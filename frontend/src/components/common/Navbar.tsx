import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import useLogout from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";

const Navbar = () => {
  const { state } = useAuthContext();
  const { logout } = useLogout();
  const handleLogout = () => {
    logout();
  };
  const username = state.user?.email || "";
  return (
    <header className="flex items-center justify-between py-4 px-8 bg-gray-100 border-b border-gray-300">
      <Link to={"/"}>Home</Link>
      <div className="flex items-center gap-6">
        {state.user ? (
          <>
            <span>{username}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={"/login"}>Login</Link>
            <Link to={"/signup"}>Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
