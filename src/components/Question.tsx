import { useExam } from "../context/ExamContext";
import type { Question as QuestionType } from "../context/ExamContext";
import { Typography, FormGroup, FormControlLabel, Checkbox, Radio, RadioGroup, Box } from "@mui/material";

interface QuestionProps {
  q: QuestionType;
  mode: "test" | "study";
}

export default function Question({ q, mode }: QuestionProps) {
  const { exam, answerQuestion } = useExam();

  const handleChange = (value: string) => {
    if (!exam) return;
    let selected = exam.answers[q.id] || [];
    if (q.multiple) {
      selected = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value];
    } else {
      selected = [value];
    }
    answerQuestion(q.id, selected);
  };

  const isChecked = (letter: string) => exam?.answers[q.id]?.includes(letter);

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2, sm: 3 },
        border: "1px solid #ccc",
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" } }}
      >
        {q.question}
      </Typography>

      {q.multiple ? (
        <FormGroup sx={{ gap: { xs: 1, sm: 1.5 } }}>
          {q.options.map(opt => (
            <FormControlLabel
              key={opt.letter}
              control={
                <Checkbox
                  checked={isChecked(opt.letter)}
                  onChange={() => handleChange(opt.letter)}
                  sx={{ transform: { xs: "scale(1.3)", sm: "scale(1.2)" } }}
                />
              }
              label={<Typography sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>{`${opt.letter}. ${opt.text}`}</Typography>}
            />
          ))}
        </FormGroup>
      ) : (
        <RadioGroup
          value={exam?.answers[q.id]?.[0] || ""}
          onChange={(e) => handleChange(e.target.value)}
          sx={{ gap: { xs: 1, sm: 1.5 } }}
        >
          {q.options.map(opt => (
            <FormControlLabel
              key={opt.letter}
              value={opt.letter}
              control={<Radio sx={{ transform: { xs: "scale(1.3)", sm: "scale(1.2)" } }} />}
              label={<Typography sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>{`${opt.letter}. ${opt.text}`}</Typography>}
            />
          ))}
        </RadioGroup>
      )}

      {mode === "study" && exam?.answers[q.id] && (
        <Typography
          sx={{ mt: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
          color={
            q.correctAnswers.every(a => exam.answers[q.id].includes(a)) &&
            exam.answers[q.id].length === q.correctAnswers.length
              ? "green"
              : "red"
          }
        >
          {q.correctAnswers.every(a => exam.answers[q.id].includes(a)) &&
           exam.answers[q.id].length === q.correctAnswers.length
            ? `✔ Correcto. ${q.explanation}`
            : `✖ Incorrecto. ${q.explanation}`}
        </Typography>
      )}
    </Box>
  );
}
