import * as React from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { Box, Container, Typography, Button } from "@mui/material";
import Footer from "./footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPrimaryImage("bar-top.jpg");
    setSecondaryImage("bar-bottom.jpg");
  }, []);

  return (
    <ParallaxProvider>
      <Box sx={{ height: 100 }} />
      {secondaryImage && (
        <Parallax speed={-20}>
          <div
            style={{
              backgroundImage: `url(${secondaryImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "90vh",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
        </Parallax>
      )}


      <Box
        component="section"
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 1,
          backgroundColor: "#ffffff", 
          padding: { xs: "30px 10px", sm: "40px 10px" },
          textAlign: "left",
        }}
      >
        <Container>
          <Typography
            variant="h2"
            gutterBottom
            className="header"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, 
            }}
          >
            Cocktail App
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            className="flow-text"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, 
            }}
          >
            Está a fim de se refrescar nesse verão? Provar uma nova receita ao invés da mesma de sempre? <br />
            Explore nosso menu de receitas clicando no botão abaixo, toda vez que recarregar a página novas opções e universos a serem explorados.
          </Typography>
          <Box mt={5}>
            <Typography variant="h3" component="div">
              <i className="mdi-content-send brown-text"></i>
            </Typography>
            <Typography
              variant="h6"
              align="right" 
              paragraph
              className="right-align light"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Clique aqui para uma experiência nova
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={() => navigate("/receitas")}
              className="btn-large waves-effect waves-light red"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" }, 
                padding: { xs: "10px 20px", sm: "15px 30px" }, 
              }}
            >
              QUERO EXPERIMENTAR
            </Button>
          </Box>
        </Container>
      </Box>

      {primaryImage && (
        <Parallax speed={-20}>
          <div
            style={{
              backgroundImage: `url(${primaryImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "30vh", 
              width: "100%",
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: -1,
            }}
          />
        </Parallax>
      )}
      <Footer />
    </ParallaxProvider>
  );
}
