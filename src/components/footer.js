import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      className="container"
      sx={{
        position: "fixed",  
        bottom: 0,          
        left: 0,           
        right: 0,          
        width: "100%",     
        backgroundColor: "rgba(0, 0, 0, 0.6)",  
        zIndex: 999,        
        textAlign: 'center', 
        padding: "10px",    
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    >
      <Typography variant="h6" component="h5" sx={{ color: "#fff" }}>
        © {new Date().getFullYear()} Cocktail App. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
