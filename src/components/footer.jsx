import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setTimeout(() => {
        const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
        setIsVisible(!hasScroll);
      }, 200);
    };

    const handleScroll = () => {
      setIsVisible(true); 
    };

    checkScroll(); 
    window.addEventListener("resize", checkScroll);
    window.addEventListener("scroll", handleScroll, { once: true });

    return () => {
      window.removeEventListener("resize", checkScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 999,
        textAlign: "center",
        padding: "10px",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <Typography variant="h6" component="h5" sx={{ color: "#fff" }}>
        © {new Date().getFullYear()} Cocktail App. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
