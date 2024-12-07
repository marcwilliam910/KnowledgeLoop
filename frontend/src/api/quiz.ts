import {Quiz} from "@/types";
import axios from "axios";

export async function addQuiz({
  quizForm,
  subject,
}: {
  quizForm: Omit<Quiz, "id">;
  subject: string;
}) {
  const {data} = await axios.post(
    `http://127.0.0.1:8000/api/quizzes/${subject}/`,
    quizForm,
    {
      withCredentials: true,
    }
  );
  return data;
}

export async function deleteQuiz({
  selectedQuiz,
  selectedSubject,
}: {
  selectedQuiz: string;
  selectedSubject: string;
}) {
  await axios.delete(
    `http://127.0.0.1:8000/api/quizzes/${selectedSubject}/${selectedQuiz}/`,
    {
      withCredentials: true,
    }
  );
}

export async function updateQuiz({
  subject,
  topic,
  quizForm,
}: {
  subject: string;
  topic: string;
  quizForm: Omit<Quiz, "id">;
}) {
  if (!subject || !topic) {
    throw new Error("Subject and topic must be provided");
  }
  try {
    const {data} = await axios.put<{message: string; quiz: Quiz}>(
      `http://127.0.0.1:8000/api/quizzes/${encodeURIComponent(
        subject
      )}/${encodeURIComponent(topic)}/edit/`,
      quizForm,
      {
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to update quiz: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
}
