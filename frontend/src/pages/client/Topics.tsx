import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {useQuizzes} from "@/hooks/useQuizzes";
import {AlertCircle, ChevronLeft, LoaderCircle} from "lucide-react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function Topics() {
  const {subject} = useParams<{subject: string}>();
  const navigate = useNavigate();

  const {data: quizzes, isPending, isError} = useQuizzes();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

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

  const topics = quizzes.find(
    (quiz) => quiz.name.toLowerCase() === subject?.toLowerCase()
  );

  if (!topics) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen p-4 bg-[#0A0A0A]">
        <Card className="w-full max-w-md text-white bg-[#121212] border-none">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              No Quiz Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-400">
              Sorry, we couldn't find a quiz for {subject}.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-700"
              size="lg"
              onClick={() => {
                navigate(`/dashboard`);
              }}
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center px-3 py-5 sm:py-8">
        <Button
          className="absolute text-white rounded-full left-3 hover:bg-purple-600 md:left-7 md:size-10"
          size="icon"
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
          {subject}
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 p-4 sm:px-16 lg:px-28">
        {topics.quizzes.length === 0 ? (
          <div className="mt-10 text-2xl text-center text-purple-500">
            No Available Quiz
          </div>
        ) : (
          topics.quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="w-full duration-150 cursor-pointer hover:bg-purple-600 bg-[#121212] border-zinc-200/10 text-[#E0E0E0] "
              onClick={() => navigate(`/dashboard/${subject}/${quiz.name}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between md:text-lg">
                <CardTitle>{quiz.name}</CardTitle>
                <span className="text-xs text-zinc-200/50 md:text-sm">
                  {quiz.quiz.length} question
                  {quiz.quiz.length > 1 ? "s" : ""}
                </span>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
