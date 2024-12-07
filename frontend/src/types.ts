export type Quizzes = {
  name: string;
  quizzes: Quiz[];
};

export type Quiz = {
  id: number;
  name: string;
  quiz: Question[];
};

export type Question = {
  question: string;
  options: string[];
  answer: string;
};
