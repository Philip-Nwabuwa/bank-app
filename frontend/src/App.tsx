import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

const queryClient = new QueryClient({
  defaultOptions: {},
});

function Layout() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout />
          <Toaster richColors position="top-center" />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </main>
  );
}

export default App;
