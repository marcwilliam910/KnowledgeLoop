import axios from "axios";

export async function getQuizzes() {
  const {data} = await axios.get("http://127.0.0.1:8000/api/quizzes/");
  return data;
}
