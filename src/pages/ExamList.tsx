import { useEffect, useState } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ExamList() {
  const [files, setFiles] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}parsed-exams/exams.json`)
      .then(res => res.json())
      .then(setFiles)
      .catch(err => console.error("Error cargando exams.json:", err));
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh", bgcolor: "background.default" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.2rem" },
          mb: 4,
        }}
      >
        Selecciona un examen
      </Typography>

      {/* Grid adaptativo */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",        // móvil: 1 columna
            sm: "1fr 1fr",    // tablet: 2 columnas
            md: "1fr 1fr 1fr" // desktop: 3 columnas
          },
        }}
      >
        {files.map(f => (
          <Paper
            key={f}
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              minHeight: "150px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                textAlign: "center",
                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem" },
              }}
            >
              {f.replace(".json", "")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(`/exam/${f}/test`)}
                sx={{ minWidth: "100px", flexGrow: 1 }}
              >
                Modo Test
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(`/exam/${f}/study`)}
                sx={{ minWidth: "100px", flexGrow: 1 }}
              >
                Modo Estudio
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
