import React, { createContext, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ExamProvider } from "./context/ExamContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "./theme";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function Root() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem("themeMode") as 'light' | 'dark') || 'light'
  );

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prev) => {
        const newMode = prev === "light" ? "dark" : "light";
        localStorage.setItem("themeMode", newMode);
        return newMode;
      });
    },
  }), []);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ExamProvider>
            <App />
          </ExamProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
