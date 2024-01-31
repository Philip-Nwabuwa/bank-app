import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import AuthLayout from "./pages/auth/AuthLayout";
import LoginForm from "./components/modules/LoginForm";
import SignUpForm from "./components/modules/SignUpForm";
import NotFound from "./pages/NotFound";
import MainLayout from "./pages/Main/MainLayout";
import {
  Dashboard,
  Messages,
  Profile,
  Transactions,
  Wallet,
} from "./pages/Main";
import ProtectedRoute from "./components/modules/auth/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/signup",
          element: <SignUpForm />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/",
      element: <Navigate to="/dashboard" replace />,
    },
    {
      element: <MainLayout />,
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/transactions",
          element: (
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/wallet",
          element: (
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
