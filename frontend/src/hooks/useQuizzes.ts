import {getQuizzes} from "@/api/quizzes";
import {Quizzes} from "@/types";
import {useQuery} from "@tanstack/react-query";

export function useQuizzes() {
  return useQuery<Quizzes[]>({
    queryKey: ["subjects"],
    queryFn: getQuizzes,
  });
}
