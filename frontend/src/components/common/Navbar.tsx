import { Button } from "../ui/button";
import { useLogout } from "@/api/userdetails";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  const { mutateAsync, isLoading } = useLogout();

  const handleLogout = async () => {
    const response = await mutateAsync();
    toast.success(response?.data.message);
  };

  return (
    <header className="fixed h-[80px] px-10 py-4 z-20 w-full flex items-center justify-between bg-slate-100">
      <div className="flex items-center text-lg font-medium">
        <CreditCard className="w-10 h-10 text-accent pr-2 text-black" />
        FundFirst
      </div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Navbar;
