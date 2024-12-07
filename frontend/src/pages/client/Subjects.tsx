import SubjectCard from "@/components/client/SubjectCard";
import {useQuizzes} from "@/hooks/useQuizzes";
import {
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Clock,
  LoaderCircle,
} from "lucide-react";

type SubjectIcons = Record<string, React.ComponentType<{className?: string}>>;
const subjectIcons: SubjectIcons = {
  "Mathematics": Calculator,
  "Science": Beaker,
  "English": BookOpen,
  "Geography": Globe,
  "History": Clock,
};

export default function Subjects() {
  const {data: quizzes, isPending, isError} = useQuizzes();

  if (isPending) {
    return (
      <div className="flex justify-center w-full mt-10 text-3xl text-white md:mt-16">
        <LoaderCircle className="animate-spin size-7 md:size-12" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center px-4 mt-10 text-white md:mt-16 md:text-3xl">
        <p className="text-center text-red-500">
          Something went wrong, please try to refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-3 py-6">
      <h1 className="text-2xl font-extrabold text-white md:text-4xl sm:my-3">
        Choose a Subject
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
        {quizzes.map((quiz) => {
          const Icon = subjectIcons[quiz.name] || BookOpen;
          return <SubjectCard data={quiz} Icon={Icon} key={quiz.name} />;
        })}
      </div>
    </div>
  );
}
