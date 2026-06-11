const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;
const JWT_SECRET = 'mi_clave_secreta_para_el_gym'; 

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a SQLite
const db = new sqlite3.Database('./gym.db', (err) => {
    if (err) console.error("Error al abrir la BD:", err.message);
    else console.log("Conectado con éxito a la base de datos SQLite.");
});

// Crear tablas iniciales
db.serialize(() => {
    // 1. Tabla de Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        nombre TEXT,
        role TEXT
    )`);

    // 2. Tabla de Ejercicios (CORREGIDO AQUÍ)
    db.run(`CREATE TABLE IF NOT EXISTS ejercicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        grupoMuscular TEXT,
        maquina TEXT,
        series INTEGER,
        repeticiones INTEGER
    )`);

    // Insertar usuarios de prueba por defecto
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

// Middleware para verificar el Token JWT
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ mensaje: "Token requerido." });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ mensaje: "Token inválido o expirado." });
        req.usuario = decoded;
        next();
    });
};

// ==================== RUTAS DE LA API ====================

// 1. Login (Autenticación JWT) [cite: 69]
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

// 2. Leer todos los ejercicios (Accesible por ambos roles) [cite: 80, 87]
app.get('/api/ejercicios', verificarToken, (req, res) => {
    db.all("SELECT * FROM ejercicios", [], (err, rows) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener ejercicios." });
        res.json(rows);
    });
});

// 3. Crear ejercicio (SOLO ADMINISTRADOR) [cite: 81, 89]
app.post('/api/ejercicios', verificarToken, (req, res) => {
    if (req.usuario.role !== 'Administrador') {
        return res.status(403).json({ mensaje: "Acceso denegado. Requiere rol Administrador." });
    }

    const { nombre, grupoMuscular, maquina, series, repeticiones } = req.body;
    db.run("INSERT INTO ejercicios (nombre, grupoMuscular, maquina, series, repeticiones) VALUES (?, ?, ?, ?, ?)",
        [nombre, grupoMuscular, maquina, series, repeticiones],
        function(err) {
            if (err) return res.status(500).json({ mensaje: "Error al guardar." });
            res.status(201).json({ id: this.lastID, nombre, grupoMuscular, maquina, series, repeticiones });
        }
    );
});

// 4. Editar ejercicio (SOLO ADMINISTRADOR) [cite: 82, 90]
app.put('/api/ejercicios/:id', verificarToken, (req, res) => {
    if (req.usuario.role !== 'Administrador') {
        return res.status(403).json({ mensaje: "Acceso denegado. Requiere rol Administrador." });
    }

    const { id } = req.params;
    const { nombre, grupoMuscular, maquina, series, repeticiones } = req.body;

    db.run(
        "UPDATE ejercicios SET nombre = ?, grupoMuscular = ?, maquina = ?, series = ?, repeticiones = ? WHERE id = ?",
        [nombre, grupoMuscular, maquina, series, repeticiones, id],
        function(err) {
            if (err) return res.status(500).json({ mensaje: "Error al actualizar." });
            res.json({ mensaje: "Ejercicio actualizado con éxito." });
        }
    );
});

// 5. Eliminar ejercicio (SOLO ADMINISTRADOR) [cite: 83, 91]
app.delete('/api/ejercicios/:id', verificarToken, (req, res) => {
    if (req.usuario.role !== 'Administrador') {
        return res.status(403).json({ mensaje: "Acceso denegado. Requiere rol Administrador." });
    }

    const { id } = req.params;
    db.run("DELETE FROM ejercicios WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar." });
        res.json({ mensaje: "Ejercicio eliminado con éxito." });
    });
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});