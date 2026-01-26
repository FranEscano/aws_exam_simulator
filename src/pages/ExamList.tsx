import { useEffect, useState } from "react";
import { Button, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useExam, type ExamAttempt } from "../context/ExamContext";

export default function ExamList() {
  const [files, setFiles] = useState<string[]>([]);
  const navigate = useNavigate();
  const { getHistory } = useExam();
  const history: ExamAttempt[] = getHistory();
  const [limit, setLimit] = useState(10);

  const visibleHistory = history.slice(0, limit);
  const hasMore = history.length > limit;

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}parsed-exams/exams.json`)
      .then(res => res.json())
      .then(setFiles)
      .catch(err => console.error("Error cargando exams.json:", err));
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: "800px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 3 }}
      >
        Selecciona un examen
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",        
            sm: "1fr 1fr",    
            md: "1fr 1fr 1fr" 
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

      {history.length > 0 && (
        <>
          <Divider sx={{ my: 5 }} />
          <Typography variant="h5" sx={{ mb: 2}}>
            Your Exam History
          </Typography>
          
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "grey.100 "}}>
                <TableRow>
                  <TableCell><strong>Exam</strong></TableCell>
                  <TableCell align="center"><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="center"><strong>Result</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleHistory.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>{attempt.title}</TableCell>
                    <TableCell align="center">{attempt.date.split(',')[0]}</TableCell>
                    <TableCell align="center">{attempt.score}%</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: attempt.score >= 70 ?
                        'success.main': 'error.main' }}>
                          {attempt.score >= 70 ? "PASS" : "NO PASS"}
                        </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="text" onClick={() => setLimit(prev => prev + 10)} sx={{ textTransform: 'none'}}>
                Show more exams (+10)
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
