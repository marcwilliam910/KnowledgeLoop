import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Lock, UserCog} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {handleAdminLogin} from "@/api/auth";
import {successToast} from "@/toast";
import {generateRandomString} from "@/utils/RandomString";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const {mutate, isPending} = useMutation({
    mutationFn: handleAdminLogin,
    onSuccess: (data: {message: string}) => {
      sessionStorage.setItem("tokenAdmin", generateRandomString());
      successToast(data.message);
      navigate("/admin/dashboard");
    },
    onError: (error: any) => {
      setError(error.response?.data.error || "Admin login failed.");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username || !password) {
      setError("Admin credentials are required");
      return;
    }

    mutate({username, password});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] px-3">
      <Card className="w-full max-w-md bg-[#121212] border-none text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserCog size={48} className="text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold ">
            Admin Access Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="admin-username" className="flex items-center">
                <UserCog size={16} className="mr-2 text-gray-500" />
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2"
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="admin-password" className="flex items-center">
                <Lock size={16} className="mr-2 text-gray-500" />
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                disabled={isPending}
              />
            </div>

            {error && (
              <div className="p-2 text-sm text-center text-red-500 border border-red-200 rounded bg-red-50">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-700"
              disabled={isPending}
            >
              {isPending ? "Authenticating..." : "Admin Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
