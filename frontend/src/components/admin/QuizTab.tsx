import {useQuizzes} from "@/hooks/useQuizzes";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Button} from "../ui/button";
import {BookIcon, LoaderCircle, Pencil, Trash2} from "lucide-react";
import {Card, CardHeader, CardTitle, CardContent} from "../ui/card";
import {Badge} from "../ui/badge";
import {useState} from "react";
import DeleteDialog from "./DeleteDialog";
import {useNavigate} from "react-router-dom";

export default function QuizTab() {
  const {data: quizzes, isPending, isError} = useQuizzes();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const navigate = useNavigate();

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
    <>
      <DeleteDialog
        isOpen={deleteDialogOpen}
        openChange={setDeleteDialogOpen}
        selectedQuiz={selectedQuiz}
        selectedSubject={selectedSubject}
      />

      <Card className="w-full max-w-4xl mx-auto bg-[#121212] text-white border-gray-700">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center gap-1 text-xl font-bold sm:text-2xl">
            <BookIcon className="text-blue-600 size-8 md:size-10" />
            <h2 className="text-center">Quiz Management Dashboard</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subjects" className="space-y-6">
            <TabsList className="w-full text-white bg-transparent border ">
              <TabsTrigger
                value="subjects"
                className="w-full text-sm transition-all rounded-md sm:text-base"
              >
                Subjects
              </TabsTrigger>
              <TabsTrigger
                value="topics"
                className="w-full text-sm transition-all rounded-md sm:text-base"
              >
                Topics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="subjects">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption className="mb-2 font-semibold">
                    Available Subjects
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Name</TableHead>
                      <TableHead>Quizzes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((subject) => (
                      <TableRow key={subject.name}>
                        <TableCell className="font-medium md:text-base">
                          {subject.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="md:text-sm">
                            {subject.quizzes.length} topic
                            {subject.quizzes.length > 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="topics" className="space-y-6">
              {quizzes.map((subject) => (
                <Card
                  key={subject.name}
                  className="bg-[#121212] text-white border-gray-700"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-600">
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40%]">Topic</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subject.quizzes.map((topic) => (
                            <TableRow key={topic.name}>
                              <TableCell className="font-medium md:text-base">
                                {topic.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="text-white md:text-sm"
                                >
                                  {topic.quiz.length}
                                </Badge>
                              </TableCell>
                              <TableCell className="flex justify-end gap-2">
                                <Button
                                  size="icon"
                                  className="text-xs bg-yellow-500 sm:text-sm hover:bg-yellow-600"
                                  onClick={() => {
                                    navigate(
                                      `/admin/edit/${subject.name}/${topic.name}/`
                                    );
                                  }}
                                >
                                  <Pencil />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="text-xs sm:text-sm hover:bg-red-600"
                                  onClick={() => {
                                    setDeleteDialogOpen(true);
                                    setSelectedQuiz(topic.name);
                                    setSelectedSubject(subject.name);
                                  }}
                                >
                                  <Trash2 />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {quizzes.length === 0 && (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p>No quizzes found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
