import { Outlet } from "react-router-dom";

import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/modules/Sidebar";

const MainLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-grow overflow-hidden">
          <Sidebar />
          <main className="flex-grow md:ml-[250px] pt-[80px]">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
