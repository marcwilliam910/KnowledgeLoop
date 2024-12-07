import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {successToast} from "@/toast";
import {useNavigate} from "react-router-dom";
import {LoaderCircle, Orbit} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {handleLogin, handleRegister} from "@/api/auth";
import {generateRandomString} from "@/utils/RandomString";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {mutate: loginMutate, isPending: isLoginPending} = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data: {message: string}) => {
      sessionStorage.setItem("token", generateRandomString());
      successToast(data.message);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.response?.data.error);
    },
  });

  const {mutate: registerMutate, isPending: isRegisterPending} = useMutation({
    mutationFn: handleRegister,
    onSuccess: (data: {message: string}) => {
      successToast(data.message);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.response?.data.error || "Registration failed.");
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    if (isLogin) {
      loginMutate({username, password});
    } else {
      registerMutate({username, password});
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form state when switching
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-3 bg-[#0A0A0A]">
      {(isLoginPending || isRegisterPending) && (
        <div className="absolute inset-0 z-50 bg-black/80"></div>
      )}
      <Card className="w-full max-w-md bg-[#121212] border-none text-white">
        <CardHeader>
          <div className="flex items-center justify-center gap-1 mb-2">
            <Orbit className="text-blue-500" size={32} />
            <div className="font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
              KnowledgeLoop
            </div>
          </div>
          <CardTitle className="md:text-xl">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
              />
            </div>

            {error && (
              <div className="p-2 text-sm text-center text-red-500 border border-red-200 rounded bg-red-50">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-700"
              >
                {isLoginPending || isRegisterPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                className="text-xs text-white"
                onClick={toggleAuthMode}
              >
                {isLogin
                  ? "Need an account? Register"
                  : "Already have an account? Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
