import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Auth from "./pages/client/Auth.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import Dashboard from "./pages/client/Dashboard.tsx";
import Topics from "./pages/client/Topics.tsx";
import Subjects from "./pages/client/Subjects.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Quiz from "./pages/client/Quiz.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AddQuiz from "./pages/admin/AddQuiz.tsx";
import EditQuiz from "./pages/admin/EditQuiz.tsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <Subjects />,
      },
      {
        path: ":subject",
        element: <Topics />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/quiz",
    element: <AddQuiz />,
  },
  {
    path: "/admin/edit/:subject/:topic",
    element: <EditQuiz />,
  },
  {
    path: "/dashboard/:subject/:topic",
    element: <Quiz />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <ToastContainer />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={route} />
    </QueryClientProvider>
  </StrictMode>
);
