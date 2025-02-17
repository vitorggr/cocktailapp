import React from "react";
import Navbar from "./navbar";
import "./materialize.css";
import {
  createTheme,
  ThemeProvider,
  Box
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

export default function Layout({ children }) {
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Box sx={{ height: 64 }} />
        {children}
      </ThemeProvider>
    </>
  );
}