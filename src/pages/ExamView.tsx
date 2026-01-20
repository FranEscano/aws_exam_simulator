import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useExam } from "../context/ExamContext";
import { Typography, Button, Box, LinearProgress } from "@mui/material";
import Question from "../components/Question";

export default function ExamView() {
  const { file, mode } = useParams();
  const { exam, loadExam, finishExam } = useExam();
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (file && mode) loadExam(file, mode as "test" | "study");
  }, [file, mode]);

  if (!exam) return <Typography>Cargando examen...</Typography>;

  const handleFinish = () => setFinished(true);

  const result = finished ? finishExam() : { score: 0, correctCount: 0, total: 0 };
  const { score, correctCount, total } = result;
  const passed = score >= 70;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {!finished ? (
        <>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
              textAlign: "center",
            }}
          >
            {exam.title}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(Object.keys(exam.answers).length / exam.questions.length) * 100}
            sx={{ my: 2, height: { xs: 10, sm: 12 } }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {exam.questions.map(q => (
              <Question key={q.id} q={q} mode={exam.mode} />
            ))}
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleFinish}
            sx={{ mt: 3, width: "100%", maxWidth: "400px", alignSelf: "center" }}
          >
            Finalizar
          </Button>
        </>
      ) : (
        <>
          <Box sx={{
            textAlign: 'center',
            p: 4,
            mb: 4,
            borderRadius: 3,
            bgcolor: passed ? 'success.light' : 'error.light',
            color: passed ? 'success.contrastText' : 'error.contrast.Text'
          }}>
            <Typography variant="h3" fontWeight="bold">Resultado: {score}%</Typography>
            <Typography variant="h5">{passed ? "PASSED EXAM!" : "NOT PASSED EXAM"}</Typography>
            <Typography sx={{ mt: 1 }}>You got {correctCount} right answers out of {total} questions</Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>Questions review:</Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}>
            {exam.questions.map(q => {
              const studentAnswers = exam.answers[q.id] || [];
              const isCorrect =
                studentAnswers.length === studentAnswers.length && q.correctAnswers.every(ans => studentAnswers.includes(ans));

              return (
                <Box
                  key={q.id}
                  sx={{
                    border: "2px solid",
                    borderColor: isCorrect ? "success.main" : "error.main",
                    borderRadius: 2,
                    p: 3,
                    bgcolor: "background.paper"
                  }}>
                  <Typography
                    fontWeight="bold"
                    sx={{ mb: 1 }}>
                      {isCorrect ? "✅ " : "❌ "} Question {q.id}
                  </Typography>

                  <Typography>{q.question}</Typography>

                  <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Your answers:</strong>
                      {studentAnswers.join(", ") || "No answered"}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      <strong>Correct:</strong>
                      {q.correctAnswers.join(", ")}
                    </Typography>
                  </Box>

                  {q.explanation && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                      <strong>Explanation:</strong>
                      {q.explanation}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{ mt: 4, mb: 10 }}
          >
            Back
          </Button>
        </>
      )}
    </Box>
  );
}
