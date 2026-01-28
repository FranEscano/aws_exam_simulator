import React, { createContext, useContext, useEffect, useState } from "react";

export interface Question {
  id: number;
  question: string;
  options: { letter: string; text: string }[];
  multiple: boolean;
  correctAnswers: string[];
  explanation?: string;
}

export interface ExamAttempt {
  id: string; // A unique identifier
  title: string; // Exam title
  date: string; // Date in a reading format
  score: number; // Score of the exam taken
  correct: number; // Number of correct answers
  total: number; // Total number of questions
  userAnswers: Record<number, string[]>;
  questionSnapshot: Question[];
}

interface ExamState {
  title: string;
  questions: Question[];
  answers: Record<number, string[]>;
  mode: "test" | "study";
  startTime: number | null;
  timeLeft: number;
}

interface ExamContextType {
  exam: ExamState | null;
  loadExam: (file: string, mode: "test" | "study") => Promise<void>;
  answerQuestion: (id: number, selected: string[]) => void;
  finishExam: () => { score: number; correctCount: number; total: number };
  setTimeLeft: (time: number) => void;
  getHistory: () => ExamAttempt[];
  loadRandomMock: (allFiles: string[], totalQuestions: number) => Promise<boolean>;
}

const ExamContext = createContext<ExamContextType | null>(null);

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for(let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

    let questions = data.questions;

    if(mode === "test") {
      questions = shuffleArray<Question>(questions).map((q: Question) => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    }

    setExam({ ...data, questions, answers: {}, mode, startTime: Date.now(), timeLeft: 3600 });
  };

  const loadRandomMock = async (allFiles: string[], totalQuestions: number = 65) => {
    try{
      const selectedFiles = allFiles.sort(() => 0.5 - Math.random()).slice(0, 10);

      const allQuestionsPromise = selectedFiles.map(async (file) => {
        const res = await fetch(`${import.meta.env.BASE_URL}parsed-exams/${file}`);
        const data = await res.json();
        return data.questions as Question[];
      });

      const results = await Promise.all(allQuestionsPromise);
      const poolOfQuestions = results.flat();

      const shuffledQuestions = shuffleArray<Question>(poolOfQuestions)
        .slice(0, totalQuestions)
        .map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));

        setExam({
          title: `MOCK - ${new Date().toLocaleString()}`,
          questions: shuffledQuestions,
          answers: {},
          mode: "test",
          startTime: Date.now(),
          timeLeft: 5400
        });

        return true;
    } catch (error) {
      console.error("Error generating mock exam:", error);
      return false;
    }
  };

  const setTimeLeft = (time: number) => {
    setExam(prev => prev ? { ...prev, timeLeft: time } : null);
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

      // ----- Save record in LocalStorage ----
      const newAttempt: ExamAttempt = {
        id: Date.now().toString(),
        title: exam.title,
        date: new Date().toLocaleString(),
        score: score,
        correct: correctCount,
        total: total,
        userAnswers: { ...exam.answers },
        questionSnapshot: [...exam.questions]
      };

      // Recover previous historic, add the new one and save
      const historyRaw = localStorage.getItem("aws_exam_history");
      const history: ExamAttempt[] = historyRaw ? JSON.parse(historyRaw) : [];
      localStorage.setItem("aws_exam_history", JSON.stringify([newAttempt, ...history]));
      // --------------------------------------------

      localStorage.removeItem("aws_exam_current");
      return { score, correctCount, total };
  };

  const getHistory = (): ExamAttempt[] => {
    const historyRaw = localStorage.getItem("aws_exam_history");
    return historyRaw ? JSON.parse(historyRaw) : [];
  }

  return (
    <ExamContext.Provider value={{ exam, loadExam, answerQuestion, finishExam, setTimeLeft, getHistory, loadRandomMock }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext) as ExamContextType;
