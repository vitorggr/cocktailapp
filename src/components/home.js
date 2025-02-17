import * as React from "react";
import { Parallax } from "react-parallax";
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
    <>
      {primaryImage && (
        <Parallax bgImage={primaryImage} className="responsive-img" strength={600}>
          <div style={{ height: 280 }}>
            <h1 style={{ textAlign: "center", color: "#fff", paddingTop: 200 }}></h1>
          </div>
        </Parallax>
      )}

      <Container className="container">
        <Box component="section" id="section" className="section">
          <Container id="content" className="section">
            <Typography variant="h2" gutterBottom className="header">
              Cocktail App
            </Typography>
            <Typography variant="h5" gutterBottom className="flow-text">
               Está a fim de se refrescar nesse verão? Provar uma nova receita ao invés da mesma de sempre? <br/><br/>
               Explore nosso menu de receitas clicando no botão abaixo, toda vez que recarregar a página novas opções e universos a serem explorados.
            </Typography>
            <br />
            <br />
            <Box mt={5}>
              <Typography variant="h3" component="div">
                <i className="mdi-content-send brown-text"></i>
              </Typography>
              <Typography variant="h6" align="right" paragraph className="right-align light">
                Clique aqui para uma experiência nova
              </Typography>
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={() => navigate("/receitas")}
                className="btn-large waves-effect waves-light red"
              >
                QUERO EXPERIMENTAR
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>

      {secondaryImage && (
        <Parallax bgImage={secondaryImage} className="responsive-img" strength={600}>
          <div style={{ height: 280 }}>
            <h1 style={{ textAlign: "center", color: "#fff", paddingTop: 230 }}>
              <Footer />
            </h1>
          </div>
        </Parallax>
      )}
    </>
  );
}