import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAuth } from "./auth/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Não renderizar o navbar nas páginas de login e cadastro
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Receitas", href: "/receitas" },
    { label: "Favoritos", href: "/favoritos" },
    { label: "Fale conosco", href: "/contato" },
  ];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black", marginBottom: 10 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="logo.png"
            alt="Logo"
            width={48}
            height={48}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>

        {/* Desktop View */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              component={Link}
              to={item.href}
              sx={{ color: "white" }}
            >
              {item.label}
            </Button>
          ))}
          
          {user ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ color: "white" }}
              startIcon={<ExitToAppIcon />}
            >
              Sair
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ color: "white" }}
              startIcon={<AccountCircleIcon />}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Mobile View */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={handleMenuClose}
                component={Link}
                to={item.href}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuItem
              onClick={user ? handleLogout : () => navigate("/login")}
              component={user ? "button" : Link}
              to={user ? null : "/login"}
            >
              {user ? (
                <>
                  <ExitToAppIcon sx={{ mr: 1 }} /> Sair
                </>
              ) : (
                <>
                  <AccountCircleIcon sx={{ mr: 1 }} /> Login
                </>
              )}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}