import {addQuiz} from "@/api/quiz";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {errorToast, successToast} from "@/toast";
import {Question, Quiz} from "@/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ChevronLeft, MinusCircle, PlusCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const letter: {[key: number]: string} = {
  0: "A.",
  1: "B.",
  2: "C.",
  3: "D.",
};

export default function AddQuiz() {
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
  const [subject, setSubject] = useState("English");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const {mutate, isPending} = useMutation({
    mutationFn: addQuiz,
    onSuccess: (data: {message: string}) => {
      successToast(data.message);
      queryClient.invalidateQueries({queryKey: ["subjects"]});
      setQuizForm({
        name: "",
        quiz: [{question: "", options: ["", "", "", ""], answer: ""}],
      });
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
      quizForm: {...quizForm, quiz: formattedQuiz},
      subject,
    });
  }
  console.log(quizForm);

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
          Add Quiz
        </h1>
      </div>
      <div className="w-full max-w-4xl ">
        <Card className="p-4 bg-[#121212] text-white border-gray-700 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Subject</Label>
            <Select onValueChange={setSubject} defaultValue={subject}>
              <SelectTrigger className="border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] text-white">
                <SelectGroup>
                  {[
                    "English",
                    "Mathematics",
                    "Science",
                    "History",
                    "Geography",
                  ].map((s, index) => (
                    <SelectItem key={index} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Topic</Label>
            <Input
              className="border-gray-600"
              required
              value={quizForm.name}
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
              {isPending ? "Creating Quiz..." : "Create Quiz"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
