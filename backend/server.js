const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;
const JWT_SECRET = 'mi_clave_secreta_para_el_gym'; 

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./gym.db', (err) => {
    if (err) console.error("Error al abrir la BD:", err.message);
    else console.log("Conectado con éxito a la base de datos SQLite.");
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        nombre TEXT,
        role TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ejercicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        grupoMuscular TEXT,
        maquina TEXT,
        series INTEGER,
        repeticiones INTEGER,
        imagenUrl TEXT
    )`);

    // Si la tabla ya existía sin la columna imagenUrl, la añadimos
    db.run(`ALTER TABLE ejercicios ADD COLUMN imagenUrl TEXT`, () => {});

    db.get("SELECT COUNT(*) as count FROM usuarios", [], (err, row) => {
        if (row && row.count === 0) {
            db.run("INSERT INTO usuarios (username, password, nombre, role) VALUES (?, ?, ?, ?)", 
                ['admin@gym.com', 'admin123', 'Luis Administrador', 'Administrador']);
            db.run("INSERT INTO usuarios (username, password, nombre, role) VALUES (?, ?, ?, ?)", 
                ['user@gym.com', 'user123', 'Carlos Cliente', 'Usuario']);
            console.log("Usuarios de prueba creados (Admin y User).");
        }
    });
});

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ mensaje: "Token requerido." });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ mensaje: "Token inválido o expirado." });
        req.usuario = decoded;
        next();
    });
};

const esAdmin = (req, res, next) => {
    if (req.usuario.role !== 'Administrador') {
        return res.status(403).json({ mensaje: "Acceso denegado. Requiere rol Administrador." });
    }
    next();
};

// ==================== AUTENTICACIÓN ====================

// LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM usuarios WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err) return res.status(500).json({ mensaje: "Error en el servidor." });
        if (!user) return res.status(400).json({ mensaje: "Credenciales incorrectas." });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, nombre: user.nombre },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            token,
            usuario: { id: user.id, username: user.username, role: user.role, nombre: user.nombre }
        });
    });
});

// REGISTRO (siempre crea rol Usuario)
app.post('/api/register', (req, res) => {
    const { username, password, nombre } = req.body;

    if (!username || !password || !nombre) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }
    if (password.length < 6) {
        return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
    }

    db.get("SELECT id FROM usuarios WHERE username = ?", [username], (err, existente) => {
        if (err) return res.status(500).json({ mensaje: "Error en el servidor." });
        if (existente) return res.status(409).json({ mensaje: "Ese correo ya está registrado." });

        db.run(
            "INSERT INTO usuarios (username, password, nombre, role) VALUES (?, ?, ?, ?)",
            [username, password, nombre, 'Usuario'],
            function (err) {
                if (err) return res.status(500).json({ mensaje: "Error al registrar usuario." });

                const token = jwt.sign(
                    { id: this.lastID, username, role: 'Usuario', nombre },
                    JWT_SECRET,
                    { expiresIn: '2h' }
                );

                res.status(201).json({
                    token,
                    usuario: { id: this.lastID, username, role: 'Usuario', nombre }
                });
            }
        );
    });
});

// ==================== GESTIÓN DE USUARIOS (SOLO ADMIN) ====================

// LISTAR USUARIOS
app.get('/api/usuarios', verificarToken, esAdmin, (req, res) => {
    db.all("SELECT id, username, nombre, role FROM usuarios", [], (err, rows) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener usuarios." });
        res.json(rows);
    });
});

// CAMBIAR ROL DE UN USUARIO
app.put('/api/usuarios/:id/rol', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['Administrador', 'Usuario'].includes(role)) {
        return res.status(400).json({ mensaje: "Rol inválido." });
    }

    // Evitar que el admin se quite el rol a sí mismo
    if (parseInt(id) === req.usuario.id && role !== 'Administrador') {
        return res.status(400).json({ mensaje: "No puedes quitarte tu propio rol de administrador." });
    }

    db.run("UPDATE usuarios SET role = ? WHERE id = ?", [role, id], function (err) {
        if (err) return res.status(500).json({ mensaje: "Error al actualizar el rol." });
        if (this.changes === 0) return res.status(404).json({ mensaje: "Usuario no encontrado." });
        res.json({ mensaje: "Rol actualizado con éxito." });
    });
});

// ELIMINAR USUARIO
app.delete('/api/usuarios/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;

    if (parseInt(id) === req.usuario.id) {
        return res.status(400).json({ mensaje: "No puedes eliminar tu propia cuenta." });
    }

    db.run("DELETE FROM usuarios WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar usuario." });
        if (this.changes === 0) return res.status(404).json({ mensaje: "Usuario no encontrado." });
        res.json({ mensaje: "Usuario eliminado con éxito." });
    });
});

// ==================== EJERCICIOS ====================

// LEER TODOS (con filtros opcionales: ?nombre=&grupoMuscular=)
app.get('/api/ejercicios', verificarToken, (req, res) => {
    const { nombre, grupoMuscular } = req.query;

    let sql = "SELECT * FROM ejercicios WHERE 1=1";
    const params = [];

    if (nombre) {
        sql += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }
    if (grupoMuscular) {
        sql += " AND grupoMuscular LIKE ?";
        params.push(`%${grupoMuscular}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener ejercicios." });
        res.json(rows);
    });
});

// CREAR (SOLO ADMIN)
app.post('/api/ejercicios', verificarToken, esAdmin, (req, res) => {
    const { nombre, grupoMuscular, maquina, series, repeticiones, imagenUrl } = req.body;
    db.run("INSERT INTO ejercicios (nombre, grupoMuscular, maquina, series, repeticiones, imagenUrl) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, grupoMuscular, maquina, series, repeticiones, imagenUrl || null],
        function(err) {
            if (err) return res.status(500).json({ mensaje: "Error al guardar." });
            res.status(201).json({ id: this.lastID, nombre, grupoMuscular, maquina, series, repeticiones, imagenUrl });
        }
    );
});

// EDITAR (SOLO ADMIN)
app.put('/api/ejercicios/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, grupoMuscular, maquina, series, repeticiones, imagenUrl } = req.body;

    db.run(
        "UPDATE ejercicios SET nombre = ?, grupoMuscular = ?, maquina = ?, series = ?, repeticiones = ?, imagenUrl = ? WHERE id = ?",
        [nombre, grupoMuscular, maquina, series, repeticiones, imagenUrl || null, id],
        function(err) {
            if (err) return res.status(500).json({ mensaje: "Error al actualizar." });
            res.json({ mensaje: "Ejercicio actualizado con éxito." });
        }
    );
});

// ELIMINAR (SOLO ADMIN)
app.delete('/api/ejercicios/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM ejercicios WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar." });
        res.json({ mensaje: "Ejercicio eliminado con éxito." });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});