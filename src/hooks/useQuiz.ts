import { useState, useEffect } from 'react';

export interface Option {
  text: string;
  weight: number;
}

export interface Question {
  id: number;
  question: string;
  shuffledOptions: Option[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuiz(checkerId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await import(`../data/questions/${checkerId}.json`);
        const allQuestions = data.default || data;
        
        // Pick 10 random questions
        const selected = shuffleArray(allQuestions).slice(0, 10);
        
        // Shuffle options
        const formatted: Question[] = selected.map((q: any) => ({
          id: q.id,
          question: q.question,
          shuffledOptions: shuffleArray<Option>(q.options.map((opt: string, i: number) => ({
            text: opt,
            weight: q.weight[i]
          })))
        }));
        
        setQuestions(formatted);
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load questions", err);
      }
    };
    if (checkerId) {
      loadQuestions();
    }
  }, [checkerId]);

  const selectAnswer = (weight: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: weight }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    const totalWeight = Object.values(answers).reduce((sum, w) => sum + w, 0);
    // Max score is 40 (10 questions * max weight 4)
    return Math.min(100, Math.max(0, Math.round((totalWeight / 40) * 100)));
  };

  return {
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    selectAnswer,
    nextQuestion,
    isLoaded,
    calculateScore,
    isComplete: currentQuestionIndex === questions.length - 1 && answers[currentQuestionIndex] !== undefined
  };
}