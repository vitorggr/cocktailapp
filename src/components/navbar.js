import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./materialize.css";
import {
  createTheme
} from "@mui/material";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: red[900],
      light: "#ff7961",
      dark: "#ba000d",
    },
  },
});

export default function Navbar() {
  const [anchor, setAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchor(null);
  };

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Receitas", href: "/receitas" },
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
          />
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
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
        </Box>

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
            anchorEl={anchor}
            open={Boolean(anchor)}
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
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}