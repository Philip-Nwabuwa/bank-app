import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useLogout } from "@/api/userdetails";
import { toast } from "sonner";

const Navbar = () => {
  const { mutateAsync, isLoading } = useLogout();

  const handleLogout = async () => {
    const response = await mutateAsync();
    toast.success(response?.data.message);
  };

  return (
    <header className="flex items-center justify-between py-4 px-8 bg-gray-100 border-b border-gray-300">
      <Link to={"/"}>Home</Link>
      <div className="flex items-center gap-6">
        <>
          <Button onClick={handleLogout}>
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </>
      </div>
    </header>
  );
};

export default Navbar;
