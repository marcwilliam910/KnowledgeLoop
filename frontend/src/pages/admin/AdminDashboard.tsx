import QuizTab from "@/components/admin/QuizTab";
import {Button} from "@/components/ui/button";
import {LogOut, Orbit, PlusIcon} from "lucide-react";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("tokenAdmin")) {
      navigate("/admin/login");
    }
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen w-full space-y-8">
      <header className="sticky top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#121212] md:px-10 lg:px-14 z-50">
        <div className="flex items-center justify-center gap-1">
          <Orbit className="text-blue-500 size-4 md:size-6" />
          <div className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-500 md:text-base to-purple-600 bg-clip-text lg:text-xl">
            KnowledgeLoop
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 md:gap-3">
          <Button
            className="flex items-center sm:px-2 text-[.6rem] text-white bg-blue-600 rounded-md md:text-sm hover:bg-blue-700"
            onClick={() => navigate("/admin/quiz")}
          >
            <PlusIcon className="size-4" />
            Create Quiz
          </Button>
          <Button
            variant="ghost"
            className="text-white rounded-full hover:bg-purple-200"
            size="icon"
            onClick={() => {
              sessionStorage.removeItem("tokenAdmin");
              navigate("/admin/login");
            }}
          >
            <LogOut />
          </Button>
        </div>
      </header>
      <div className="px-4">
        <QuizTab />
      </div>
    </div>
  );
}
