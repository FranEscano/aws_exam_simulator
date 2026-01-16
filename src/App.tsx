import { Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button, useMediaQuery } from "@mui/material";
import ExamList from "./pages/ExamList";
import ExamView from "./pages/ExamView";

export default function App() {
  const isTablet = useMediaQuery("(max-width:1024px)");

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
        </Routes>
      </Container>
    </>
  );
}
