import { FC, ReactNode, createContext, useReducer } from "react";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
};

type AuthAction = {
  type: "LOGIN" | "LOGOUT";
  payload: User | null;
};

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

// Create the context with the defined type
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isLoggedIn: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoggedIn: false,
    user: null,
  });

  console.log("Auth state: ", state);

  // Provide both state and dispatch to the context consumers
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
