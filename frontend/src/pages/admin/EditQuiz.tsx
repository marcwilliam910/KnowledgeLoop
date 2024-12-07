import {updateQuiz} from "@/api/quiz";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useQuizzes} from "@/hooks/useQuizzes";
import {errorToast, successToast} from "@/toast";
import {Question, Quiz} from "@/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ChevronLeft, LoaderCircle, MinusCircle, PlusCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

const letter: {[key: number]: string} = {
  0: "A.",
  1: "B.",
  2: "C.",
  3: "D.",
};
export default function EditQuiz() {
  const [quizForm, setQuizForm] = useState<Omit<Quiz, "id">>({
    name: "",
    quiz: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
      },
    ],
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {subject, topic} = useParams<{
    subject: string | undefined;
    topic: string | undefined;
  }>();

  useEffect(() => {
    if (!sessionStorage.getItem("tokenAdmin")) {
      navigate("/admin/login");
    }
  }, []);

  function handleAddQuestion() {
    setQuizForm({
      ...quizForm,
      quiz: [
        ...quizForm.quiz,
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
        },
      ],
    });
  }

  function handleRemoveQuestion(index: number) {
    if (quizForm.quiz.length > 1) {
      setQuizForm({
        ...quizForm,
        quiz: quizForm.quiz.filter((_, i) => i !== index),
      });
    }
  }

  function handleQuestionChange(
    index: number,
    optionIndex: number,
    value: string
  ) {
    // const letter: {[key: number]: string} = {
    //   0: "A.",
    //   1: "B.",
    //   2: "C.",
    //   3: "D.",
    // };
    const oldQuestions = [...quizForm.quiz];
    oldQuestions[index].options[optionIndex] = value;

    setQuizForm({...quizForm, quiz: oldQuestions});
  }

  function handleQuestionAndAnswerChange(
    index: number,
    key: keyof Omit<Question, "options">,
    value: string
  ) {
    const oldQuestions = [...quizForm.quiz];
    oldQuestions[index][key] = value;

    setQuizForm({
      ...quizForm,
      quiz: oldQuestions,
    });
  }

  const {data: quizzes, isPending: quizPending, isError} = useQuizzes();

  if (quizPending) {
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

  useEffect(() => {
    if (!subject || !topic) {
      navigate(`/admin/dashboard`);
      return;
    }
    const quiz = quizzes.find(
      (quiz) => quiz.name.toLowerCase() === subject?.toLowerCase()
    );

    const questions = quiz?.quizzes.find(
      (q) => q.name.toLowerCase() === topic?.toLowerCase()
    );

    const quizArray = questions?.quiz;
    if (quizArray) {
      setQuizForm({
        name: topic,
        quiz: quizArray,
      });
    }
  }, [topic, subject]);

  const {mutate, isPending} = useMutation({
    mutationFn: updateQuiz,
    onSuccess: (data: {message: string}) => {
      queryClient.invalidateQueries({queryKey: ["subjects"]});
      successToast(data.message);
      navigate("/admin/dashboard");
    },
    onError: (err: any) => {
      errorToast(err.response?.data.error);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Format the quiz options
    const formattedQuiz = quizForm.quiz.map((q: any) => ({
      ...q,
      options: q.options.map(
        (option: string, index: number) => `${letter[index]} ${option}`
      ),
    }));

    // Call mutate with the formatted quiz data
    mutate({
      subject: subject ?? "",
      topic: topic ?? "",
      quizForm: {...quizForm, quiz: formattedQuiz},
    });
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] px-3 py-6  md:py-10 flex flex-col items-center gap-3 sm:gap-6">
      <div>
        <Button
          className="absolute text-white rounded-full top-5 left-3 hover:bg-purple-600 md:left-7 md:size-10"
          size="icon"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ChevronLeft />
        </Button>
        <h1 className="text-xl font-bold text-white md:text-4xl sm:text-2xl ">
          Edit Quiz
        </h1>
      </div>
      <div className="w-full max-w-4xl ">
        <Card className="p-4 bg-[#121212] text-white border-gray-700 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Subject</Label>
            <Input value={subject} disabled />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Topic</Label>
            <Input
              className="border-gray-600"
              value={quizForm.name}
              required
              onChange={(e) => setQuizForm({...quizForm, name: e.target.value})}
            />
          </div>
          <form
            className="flex flex-col items-center justify-center gap-3"
            onSubmit={handleSubmit}
          >
            <div className="w-full space-y-6">
              {quizForm.quiz.map((question, index) => (
                <Card
                  key={index}
                  className="relative p-4 bg-[#121212] text-white border-gray-600"
                >
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="absolute right-2 top-2"
                    type="button"
                  >
                    <MinusCircle className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label>Question {index + 1}</Label>
                      <Input
                        required
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionAndAnswerChange(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        placeholder="Enter question"
                        className="text-xs border-gray-600"
                      />
                    </div>

                    {["A", "B", "C", "D"].map((option, optionIndex) => (
                      <div key={option} className="flex flex-col gap-2">
                        <Label>Option {option}</Label>
                        <Input
                          required
                          value={question.options[optionIndex]}
                          className="text-xs border-gray-600"
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Enter option ${option}`}
                        />
                      </div>
                    ))}

                    <div className="flex flex-col gap-2">
                      <Label>Correct Answer</Label>
                      <Select
                        value={question.answer}
                        onValueChange={(value) =>
                          handleQuestionAndAnswerChange(index, "answer", value)
                        }
                      >
                        <SelectTrigger className="border-gray-600">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121212] text-white">
                          {["A", "B", "C", "D"].map((option) => (
                            <SelectItem key={option} value={option}>
                              Option {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              type="button"
              className="w-full bg-transparent border md:w-3/4"
              onClick={handleAddQuestion}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Question
            </Button>

            <Button
              className="w-full bg-purple-500 hover:bg-purple-700 md:w-3/4"
              type="submit"
            >
              {isPending ? "Updating Quiz..." : "Update Quiz"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
