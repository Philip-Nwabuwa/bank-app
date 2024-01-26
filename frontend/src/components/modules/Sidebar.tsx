import {
  LayoutDashboard,
  MessageSquare,
  WalletCards,
  UserRound,
} from "lucide-react";
import { Icons } from "@/components/common/Icons";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      link: "/dashboard",
      icon: <LayoutDashboard className="w-8 h-8" />,
      title: "Dashboard",
    },
    {
      link: "/wallet",
      icon: <WalletCards className="w-8 h-8" />,
      title: "Wallet",
    },
    {
      link: "/transactions",
      icon: <Icons.transactions className="w-8 h-8" />,
      title: "Transactions",
    },
    {
      link: "/messages",
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Messages",
    },
    {
      link: "/profile",
      icon: <UserRound className="w-8 h-8" />,
      title: "Profile",
    },
  ];
  return (
    <aside className="md:w-[250px] flex flex-row justify-between md:justify-start items-center md:items-start gap-4 py-4 px-10 md:pl-10 md:pr-1 md:flex-col w-full h-20 md:h-screen bg-slate-100 md:pt-[100px] fixed md:top-0 left-0 bottom-0">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 md:py-3 md:pl-4 rounded-md ${
              isActive ? "md:bg-slate-300" : "md:hover:bg-slate-200"
            }`
          }
        >
          {item.icon}
          <span className="hidden md:flex">{item.title}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
