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

  const result = finished ? finishExam() : { score: 0, total: exam.questions.length };
  const { score, total } = result!;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1200px",
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
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
              textAlign: "center",
            }}
          >
            Resultado: {score}% ({score} de {total})
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {exam.questions.map(q => {
              const studentAnswers = exam.answers[q.id] || [];
              const correctAnswers = q.correctAnswers;
              const isCorrect =
                studentAnswers.length === correctAnswers.length &&
                correctAnswers.every(ans => studentAnswers.includes(ans));

              return (
                <Box
                  key={q.id}
                  sx={{
                    border: "1px solid",
                    borderColor: isCorrect ? "success.main" : "error.main",
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                  >
                    {q.id}. {q.question}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    <strong>Tus respuestas:</strong>{" "}
                    {studentAnswers.length > 0 ? studentAnswers.join(", ") : "Ninguna"}
                  </Typography>

                  {!isCorrect && (
                    <Typography sx={{ mt: 1 }} color="success.main">
                      <strong>Respuesta correcta:</strong> {correctAnswers.join(", ")}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          <Button
            sx={{ mt: 3, width: "100%", maxWidth: "400px", alignSelf: "center" }}
            variant="outlined"
            size="large"
            onClick={() => navigate("/")}
          >
            Volver
          </Button>
        </>
      )}
    </Box>
  );
}
