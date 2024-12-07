import {Button} from "@/components/ui/button";
import {Orbit} from "lucide-react";
import {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      <header className="sticky top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#121212] md:px-10 lg:px-14">
        <div className="flex items-center justify-center gap-1">
          <Orbit className="text-blue-500" size={32} />
          <div className="font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text lg:text-xl">
            KnowledgeLoop
          </div>
        </div>
        <Button
          variant="secondary"
          className="text-white bg-purple-500 hover:bg-purple-700"
          onClick={logout}
        >
          Logout
        </Button>
      </header>
      <Outlet />
    </div>
  );
}
