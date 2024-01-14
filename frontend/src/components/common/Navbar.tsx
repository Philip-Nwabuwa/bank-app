import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between py-4 px-8 bg-gray-100 border-b border-gray-300">
      <Link to={"/"}>Home</Link>
      <div className="flex items-center gap-6">
        <Link to={"/login"}>Login</Link>
        <Link to={"/signup"}>Sign Up</Link>
      </div>
    </header>
  );
};

export default Navbar;
