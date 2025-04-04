import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import Contato from "./pages/contato";
import Receitas from "./pages/receitas";
import Favoritos from "./pages/favoritos";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import { useAuth, AuthProvider } from "./components/auth/auth";
import { AuthMiddleware } from "./components/auth/middleware";
import "./components/materialize.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthMiddleware>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/receitas" element={
                  <ProtectedRoute>
                    <Receitas />
                  </ProtectedRoute>
                } />
                <Route path="/favoritos" element={
                  <ProtectedRoute>
                    <Favoritos />
                  </ProtectedRoute>
                } />
                <Route path="/contato" element={
                  <ProtectedRoute>
                    <Contato />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </AuthMiddleware>
      </AuthProvider>
    </Router>
  );
}