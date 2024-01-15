import { useAuthContext } from "./useAuthContext";

const Logout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    localStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
  };

  return { logout };
};

export default Logout;
