import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Ejercicios from "../pages/Ejercicios";
import ExploreAPI from "../pages/ExploreAPI";
import Perfil from "../pages/Perfil";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import GestionUsuarios from "../pages/GestionUsuarios";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* RUTAS PÚBLICAS */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>

        {/* RUTAS PRIVADAS */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ejercicios" element={<Ejercicios />} />
          <Route path="/usuarios" element={<GestionUsuarios />} />
          <Route path="/explorar" element={<ExploreAPI />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}