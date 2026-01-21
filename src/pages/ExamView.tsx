import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useExam } from "../context/ExamContext";
import { Typography, Button, Box, LinearProgress, Paper } from "@mui/material";
import Question from "../components/Question";

export default function ExamView() {
  const { file, mode } = useParams();
  const { exam, loadExam, finishExam, setTimeLeft } = useExam();
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (file && mode) loadExam(file, mode as "test" | "study");
      }, [file, mode]);

  useEffect(() => {
    if(!exam || finished || exam.mode === "study") return;

    const timer = setInterval(() => {
      if(exam.timeLeft <= 0) {
        clearInterval(timer);
        handleFinish();
      } else {
        setTimeLeft(exam.timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam?.timeLeft, finished, exam?.mode]);

    if (!exam) return <Typography>Exam Loading...</Typography>;

    const handleFinish = () => {
      setFinished(true);
      window.scrollTo(0, 0);
    };

    const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

    const result = finished ? finishExam() : { score: 0, correctCount: 0, total: exam.questions.length };

    const { score, correctCount, total } = result;
    const passed = score >= 70;

    return (
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: "1000px",
          margin: "0 auto",
          pb: 10
        }}
      >
        {!finished ? (
          <>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                fontWeight: 'bold', 
                textAlign: "center", 
              }}
            >
              {exam.title}
            </Typography>

            {exam.mode === "test" && (
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  textAlign: 'center', 
                  color: exam.timeLeft <
                    300 ? 'error.main' : 'primary.main',
                    fontWeight: 'bold'
                }}
              >
                Time Left: {formatTime(exam.timeLeft)}
              </Typography>
            )}
            
            <Box
              sx={{
                position: 'sticky',
                top: 10,
                zIndex: 10,
                bgcolor: 'background.default',
                py: 1
              }}
            >
              <LinearProgress
                variant="determinate"
                value={(Object.keys(exam.answers).length / exam.questions.length) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5
                }}
              />
              <Typography variant="caption" sx={{
                display: 'block',
                textAlign: 'right',
                mt: 0.5
              }}>
                Progress: {Object.keys(exam.answers).length} out of {exam.questions.length}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
              {exam.questions.map(q => (
                <Question key={q.id} q={q} mode={exam.mode} />
              ))}
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleFinish}
              sx={{ mt: 5, width: "100%", height: 56, fontSize: '1.2rem' }}
            >
              Finish and Submit
            </Button>
          </>
        ) : (
          <>
            <Paper
              elevation={3}
              sx={{
                textAlign: 'center',
                p: 4,
                mb: 4,
                borderRadius: 3,
                bgcolor: passed ? 'success.light' : 'error.light',
                color: passed ? 'success.contrastText' : 'error.contrastText'
              }}
            >
              <Typography 
                variant="h2"
                sx={{
                  fontWeight: 'bold'
                }}
              >
                Score: {score}%
              </Typography>
              <Typography 
                variant="h4"
                sx={{
                  mb: 1
                }}
              >
                {passed ? "PASSED EXAM!" : "NOT PASSED EXAM"}
              </Typography>
              <Typography 
                variant="h6"
              >
                You got {correctCount} right answers out of {total} questions
              </Typography>
            </Paper>

            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold' 
              }}
            >
              Questions review:
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {exam.questions.map(q => {
                const studentAnswers = exam.answers[q.id] || [];
                const isCorrect =
                  q.correctAnswers.length === studentAnswers.length && q.correctAnswers.every(ans => 
                    studentAnswers.includes(ans));

                return (
                  <Box
                    key={q.id}
                    sx={{
                      border: "2px solid",
                      borderColor: isCorrect ? "success.main" : "error.main",
                      borderRadius: 2,
                      p: {
                        xs: 2,
                        sm: 3
                      },
                      bgcolor: "background.paper",
                      position: 'relative'
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color={isCorrect ? "success.main" : "error.main"}
                      sx={{
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                        {isCorrect ? "✅ " : "❌ "} Question {q.id}
                    </Typography>

                    <Typography>{q.question}</Typography>

                    <Box sx={{ 
                      p: 2, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 1,
                      borderLeft: '4px solid #ccc' 
                    }}
                    >
                      <Typography 
                        variant="body2"
                        sx={{
                          mb: 1
                        }}
                      >
                        <strong>Your answers:</strong>
                        {studentAnswers.length > 0 ? studentAnswers.join(", ") : "No answered"}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="success.main" 
                        sx={{
                          fontWeight:'bold'
                        }}
                      >
                        <strong>Correct Answers:</strong>
                        {q.correctAnswers.join(", ")}
                      </Typography>
                    </Box>

                    {q.explanation && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: '#e3f2fd',
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Explanation:</strong>
                          {q.explanation}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate("/")}
              sx={{ mt: 6, height: 56 }}
            >
              Back to Main
            </Button>
          </>
        )}
      </Box>
    );
}
