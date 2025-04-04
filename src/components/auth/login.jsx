import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
          }}
        >
          <LockOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" component="h1">
            Acesse sua conta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ width: '100%', mt: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </Button>
          </Box>

          <Divider sx={{ width: '100%', my: 2 }}>OU</Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Entrar com Google
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              onClick={() => navigate("/signup")}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Não tem uma conta? Cadastre-se
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}