import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ExamProvider } from "./context/ExamContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ExamProvider>
          <App />
        </ExamProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
