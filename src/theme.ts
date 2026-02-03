import { createTheme } from "@mui/material";

export const getAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        primary: { main: '#1976d2' },
        background: { default: '#f5f5f5', paper: '#ffffff'}
      }
      :{
        primary: { main: '#90caf9' },
        background: { default: '#121212', paper: '1e1e1e' }
      }
    ),
  },
  shape: { borderRadius: 12 },
})
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" }
  },
  typography: {
    fontSize: 18
  }
});

export default theme;
