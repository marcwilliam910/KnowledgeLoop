import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Progress} from "@/components/ui/progress";
import {useQuizzes} from "@/hooks/useQuizzes";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Clock,
  ListChecks,
  LoaderCircle,
  Target,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function Quiz() {
  const {topic, subject} = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(15);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

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

  const quiz = quizzes.find(
    (quiz) => quiz.name.toLowerCase() === subject?.toLowerCase()
  );

  const questions = quiz?.quizzes.find(
    (q) => q.name.toLowerCase() === topic?.toLowerCase()
  );

  if (!quiz || !questions?.quiz?.length) {
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
              Sorry, we couldn't find a quiz for this topic.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-700"
              size="lg"
              onClick={() => {
                navigate(`/dashboard/${subject}`);
              }}
            >
              Back to {subject} Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  function handleNext() {
    if (selectedAnswer === questions?.quiz[currentQuestion].answer) {
      setScore((s) => s + 1);
    }
    if (currentQuestion + 1 >= (questions?.quiz.length || 0)) {
      setShowResults(true);
      return;
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setTimer(15);
      setSelectedAnswer(null);
    }
  }

  function handleAnswer(answer: string) {
    setSelectedAnswer(answer);
  }

  useEffect(() => {
    if (timer === 0) {
      handleNext();
      return;
    }

    let timerID: NodeJS.Timeout;
    if (isConfirm) {
      timerID = setTimeout(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearTimeout(timerID); // Cleanup timeout on unmount or re-render
  }, [timer, isConfirm]);

  function handleConfirmation() {
    setIsConfirm(true);
    setIsModalOpen(false);
  }

  const progress = ((currentQuestion + 1) / questions?.quiz.length) * 100;

  if (showResults) {
    const totalQuestions = questions?.quiz.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 50;

    return (
      <div className="flex items-center justify-center w-full min-h-screen p-4 bg-[#0A0A0A]">
        <Card className="w-full max-w-md text-white bg-[#121212] border-none">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-6xl font-bold">{percentage}%</p>
              <p className="mt-1 text-sm text-gray-400">Percentage Correct</p>
            </div>
            <div className="flex items-center justify-center">
              {passed ? (
                <div className="flex items-center text-green-500">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">You Passed!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <XCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">You Failed</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2 bg-[#0A0A0A] rounded-lg">
              <p className="flex justify-between">
                <span className="text-gray-400">Correct Answers:</span>
                <span className="font-semibold">{score}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Total Questions:</span>
                <span className="font-semibold">{totalQuestions}</span>
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-700"
              size="lg"
              onClick={() => {
                navigate(`/dashboard/${subject}`);
              }}
            >
              Back to {subject} Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={() => navigate(`/dashboard/${subject}`)}
      >
        <DialogContent className="bg-[#121212] text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold md:text-2xl">
              Ready to Start the Quiz?
            </DialogTitle>
            <DialogDescription className="text-gray-400 md:text-base">
              Please review the quiz details before starting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-purple-500" />
              <div>
                <p className="font-semibold">Time Limit</p>
                <p className="text-sm text-gray-400">
                  {timer} seconds per question
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ListChecks className="w-6 h-6 text-purple-500" />
              <div>
                <p className="font-semibold">Total Questions</p>
                <p className="text-sm text-gray-400">
                  {questions.quiz.length} questions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Target className="w-6 h-6 text-purple-500" />
              <div>
                <p className="font-semibold">Passing Score</p>
                <p className="text-sm text-gray-400">50% correct answers</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3">
            <Button
              onClick={() => navigate(`/dashboard/${subject}`)}
              className="border hover:bg-zinc-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmation}
              className="bg-purple-500 hover:bg-purple-700"
            >
              Start Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full min-h-screen bg-[#0A0A0A] px-5">
        <div className="relative flex items-center justify-center px-3 py-5 sm:py-8">
          <Button
            className="absolute text-white rounded-full left-3 hover:bg-purple-600 md:left-7 md:size-10"
            size="icon"
            onClick={() => navigate(`/dashboard/${subject}`)}
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {topic}
          </h1>
        </div>
        <div className="flex items-center justify-center w-full mt-16 sm:px-10">
          {questions?.quiz.length === 0 ? (
            <div className="mt-10 text-2xl text-center text-purple-500">
              No Available Questions
            </div>
          ) : (
            <Card className="p-4 bg-[#121212] border-none text-[#E0E0E0] flex flex-col gap-4 max-w-xl w-full ">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full text-xs">
                  <p>
                    Question {currentQuestion + 1} of {questions?.quiz.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    <span
                      className={`text-sm ${timer <= 5 ? "text-red-500" : ""}`}
                    >
                      00:{timer.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <Progress
                  value={progress}
                  className="h-4 border border-gray-500 sm:h-5"
                />
              </div>
              <h2 className="mt-5 text-lg font-bold sm:text-xl">
                {questions?.quiz[currentQuestion].question}
              </h2>
              <div className="flex flex-col gap-2 ">
                {questions?.quiz[currentQuestion].options.map(
                  (option, index) => (
                    <Button
                      key={index}
                      className={`sm:h-12 text-base ${
                        selectedAnswer == option[0]
                          ? "border border-purple-500"
                          : "border-[#0A0A0A] border hover:bg-[#0A0A0A]/40"
                      }`}
                      onClick={() => handleAnswer(option[0])}
                    >
                      <span className="mr-4">
                        {String.fromCharCode(65 + index)}.
                      </span>

                      {option.slice(2)}
                    </Button>
                  )
                )}
              </div>
              <CardFooter className="p-0 mt-5">
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-700 sm:h-10"
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                >
                  {currentQuestion === questions.quiz.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
