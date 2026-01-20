import React, { createContext, useContext, useEffect, useState } from "react";

export interface Question {
  id: number;
  question: string;
  options: { letter: string; text: string }[];
  multiple: boolean;
  correctAnswers: string[];
  explanation?: string;
}

interface ExamState {
  title: string;
  questions: Question[];
  answers: Record<number, string[]>;
  mode: "test" | "study";
  startTime: number | null;
}

interface ExamContextType {
  exam: ExamState | null;
  loadExam: (file: string, mode: "test" | "study") => Promise<void>;
  answerQuestion: (id: number, selected: string[]) => void;
  finishExam: () => { score: number; correctCount: number; total: number };
}

const ExamContext = createContext<ExamContextType | null>(null);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exam, setExam] = useState<ExamState | null>(() => {
    const savedExam = localStorage.getItem("aws_exam_current");
    return savedExam ? JSON.parse(savedExam) : null;
  });

  useEffect(() => {
    if(exam) {
    localStorage.setItem("aws_exam_current", JSON.stringify(exam));
    }
  }, [exam]);

  const loadExam = async (file: string, mode: "test" | "study") => {
    const res = await fetch(`${import.meta.env.BASE_URL}parsed-exams/${file}`);
    const data = await res.json();
    setExam({ ...data, answers: {}, mode, startTime: Date.now() });
  };

  const answerQuestion = (id: number, selected: string[]) => {
    if (!exam) return;
    const updated = { ...exam.answers, [id]: selected };
    const updatedExam = { ...exam, answers: updated };
    setExam(updatedExam);
    localStorage.setItem(exam.title, JSON.stringify(updatedExam.answers));
  };

  const finishExam = () => {
    if (!exam) return { score: 0, correctCount: 0, total: 0 };
    const correctCount = exam.questions.filter(q => {
      const studentAnswers = exam.answers[q.id] || [];
      return (
        q.correctAnswers.length === studentAnswers.length && q.correctAnswers.every(ans =>
          studentAnswers.includes(ans))
        );
      }).length;

      const total = exam.questions.length;

      const score = Math.round((correctCount / total) * 100);

      localStorage.removeItem("aws_exam_current");

      return { score, correctCount, total };
  };

  return (
    <ExamContext.Provider value={{ exam, loadExam, answerQuestion, finishExam }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext) as ExamContextType;
