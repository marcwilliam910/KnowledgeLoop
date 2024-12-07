import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import type {Quizzes} from "@/types";
import {useNavigate} from "react-router-dom";

type SubjectCardProps = {
  data: Quizzes;
  Icon: React.ComponentType<{className?: string}>;
};

export default function SubjectCard({data, Icon}: SubjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="flex flex-col items-center justify-center w-72 h-48 duration-150 cursor-pointer hover:bg-purple-600 bg-[#121212] border-none text-[#E0E0E0] sm:w-80 sm:h-56 md:w-96 md:h-64"
      onClick={() => navigate(`/dashboard/${data.name}`)}
    >
      <CardHeader className="flex flex-col items-center justify-center text-xl font-bold">
        <Icon className=" size-16 md:size-20" />
        <CardTitle className="md:text-2xl">{data.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm font-semibold text-zinc-200/50 md:text-base">
        {data.quizzes.length} Quiz
        {data.quizzes.length !== 1 ? "zes" : ""}
      </CardContent>
    </Card>
  );
}
