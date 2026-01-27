import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useExam, type ExamAttempt } from "../context/ExamContext";

export default function ReviewView() {
    const { attemptId } = useParams();
    const { getHistory } = useExam();
    const navigate = useNavigate();

    const attempt = getHistory().find((a: ExamAttempt) => a.id === attemptId);

    if(!attempt) {
        return(
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>This attempt was not found in the historic</Typography>
                <Button onClick={() => navigate("/")}>Back</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", margin: "0 auto" }}>
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h5" gutterBottom>Review: {attempt.title}</Typography>
                <Typography variant="body1">Date: {attempt.date} | Score: {attempt.score}%</Typography>
            </Paper>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {attempt.questionSnapshot.map((q, index) => {
                    const userAns = attempt.userAnswers[q.id] || [];
                    const isCorrect = q.correctAnswers.length === userAns.length &&
                        q.correctAnswers.every(a => userAns.includes(a));

                    return (
                        <Box key={q.id} sx={{
                            p: 3, border: '1px solid', borderColor: isCorrect ? 
                            'success.light' : 'error.light', borderRadius: 2, bgcolor: 'background.paper'
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">Question {index + 1}</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>{q.question}</Typography>

                            <Box sx={{ pl: 2, borderLeft: '4px solid', borderColor: isCorrect 
                                    ? 'success.main' : 'error.main'}}>
                                <Typography variant="body2" color={isCorrect ? "success.main" : "error.main"}>
                                    <strong>Your answer:</strong> {userAns.join(", ") || "No answered"}
                                </Typography>
                                {!isCorrect && (
                                    <Typography variant="body2" color="success.main">
                                        <strong>Correct answer:</strong> {q.correctAnswers.join(", ")}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2"><strong>Explanation:</strong> {q.explanation}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Button fullWidth variant="contained" sx={{ mt: 4 }} onClick={() => navigate("/")}>
                Back to Home
            </Button>
        </Box>
    );
}
