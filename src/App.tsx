import { Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button, useMediaQuery, useTheme, IconButton } from "@mui/material";
import ExamList from "./pages/ExamList";
import ExamView from "./pages/ExamView";
import ReviewView from "./components/ReviewView";
import { useContext } from "react";
import { ColorModeContext } from "./main";
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function App() {
  const isTablet = useMediaQuery("(max-width:1024px)");
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography
            variant={isTablet ? "h6" : "h5"}
            sx={{ flexGrow: 1, fontSize: isTablet ? "1.1rem" : "1.3rem" }}
          >
            AWS Exam Simulator
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>
            Home
          </Button>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          mt: isTablet ? 2 : 4,
          px: isTablet ? 1 : 3,
          maxWidth: "md",
        }}
      >
        <Routes>
          <Route path="/" element={<ExamList />} />
          <Route path="/exam/:file/:mode" element={<ExamView />} />
          <Route path="*" element={<ExamList />} />
          <Route path="/review/:attemptId" element={<ReviewView />} />
        </Routes>
      </Container>
    </>
  );
}
