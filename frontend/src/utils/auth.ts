// VERIFICA SI EL USUARIO ESTÁ AUTENTICADO
export function isAuthenticated(): boolean {
  return localStorage.getItem("token") !== null;
}

// GUARDA EL TOKEN EN LOCALSTORAGE
export function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

// OBTIENE EL TOKEN
export function getToken(): string | null {
  return localStorage.getItem("token");
}

// GUARDA EL USUARIO EN LOCALSTORAGE
export function saveUser(user: object): void {
  localStorage.setItem("user", JSON.stringify(user));
}

// OBTIENE EL USUARIO GUARDADO
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// CIERRA SESIÓN
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}