// src/utils/parseMarkdown.ts
import fs from "fs";

export interface Question {
  id: number;
  question: string;
  options: { letter: string; text: string }[];
  correctAnswers: string[]; // Array of letters, e.g., ["A", "C"]
  explanation?: string;
  multiple: boolean; // true if question says "Choose TWO", otherwise false
}

export interface Exam {
  title: string;
  questions: Question[];
}

/**
 * Parse the contents of a markdown exam file into a structured Exam object.
 */
export function parseMarkdownContent(content: string, title = "Untitled Exam"): Exam {
  const lines = content.split("\n");
  const questions: Question[] = [];

  let currentQuestion: Partial<Question> = {};
  let inExplanation = false;
  let explanationBuffer: string[] = [];

  const flushQuestion = () => {
    if (
      currentQuestion.id &&
      currentQuestion.question &&
      currentQuestion.options?.length &&
      currentQuestion.correctAnswers?.length
    ) {
      questions.push({
        id: currentQuestion.id,
        question: currentQuestion.question.trim(),
        options: currentQuestion.options,
        correctAnswers: currentQuestion.correctAnswers,
        explanation: currentQuestion.explanation ?? "",
        multiple: currentQuestion.multiple ?? false,
      });
    }
    currentQuestion = {};
    inExplanation = false;
    explanationBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Detect question line e.g. "1. What is AWS?"
    const questionMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (questionMatch) {
      flushQuestion();
      currentQuestion.id = parseInt(questionMatch[1], 10);
      currentQuestion.question = questionMatch[2].trim();
      currentQuestion.options = [];
      currentQuestion.correctAnswers = [];

      // Detect if question is multiple-choice ("Choose TWO")
      currentQuestion.multiple = /\(Choose TWO\)/i.test(currentQuestion.question);

      continue;
    }

    // Detect options (allow any letter A-Z)
    const optionMatch = line.match(/^\s*-\s*([A-Z])\.\s+(.*)$/i);
    if (optionMatch && currentQuestion.options) {
      const letter = optionMatch[1].toUpperCase();
      const optionText = optionMatch[2].trim();
      currentQuestion.options.push({ letter, text: optionText });
      continue;
    }

    // Detect correct answers (allow multiple, case-insensitive)
    const correctMatch = line.match(/^\s*Correct\s*Answer:\s*(.*)$/i);
    if (correctMatch && currentQuestion.correctAnswers) {
      currentQuestion.correctAnswers = correctMatch[1]
        .split(",")
        .map((s) => s.trim().toUpperCase());
      continue;
    }

    // Detect explanation start
    if (/^\s*Explanation:/i.test(line)) {
      inExplanation = true;
      continue;
    }

    // Collect explanation lines
    if (inExplanation) {
      // End of explanation if empty line or next question
      if (line === "" || /^\d+\.\s+/.test(line)) {
        currentQuestion.explanation = explanationBuffer.join(" ").trim();
        inExplanation = false;

        if (/^\d+\.\s+/.test(line)) {
          flushQuestion();
        }
      } else {
        explanationBuffer.push(line.replace(/^\s*-\s*/, "").trim());
      }
    }
  }

  // Flush last question
  if (Object.keys(currentQuestion).length > 0) {
    if (inExplanation) {
      currentQuestion.explanation = explanationBuffer.join(" ").trim();
    }
    flushQuestion();
  }

  return { title, questions };
}

/**
 * Utility to parse a markdown file directly.
 */
export function parseMarkdownFile(path: string, title?: string): Exam {
  const content = fs.readFileSync(path, "utf-8");
  return parseMarkdownContent(content, title ?? path);
}
