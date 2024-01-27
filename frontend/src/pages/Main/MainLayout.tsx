import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/modules/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-grow overflow-hidden">
            <Sidebar />
            <main className="flex-grow md:ml-[250px] pt-[80px]">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default MainLayout;
