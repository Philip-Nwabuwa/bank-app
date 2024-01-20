import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SignupPayload } from "@/api/userdetails";

interface User {
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  gender: string;
  email: string;
  image: string;
  _id: string;
  createdAt: string;
}

interface UserState {
  user: User;
  setUser: (newUser: User) => void;
}

interface SignUpStoreState {
  userData: SignupPayload;
  setUserData: (newData: Partial<SignupPayload>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        firstName: "",
        lastName: "",
        mobile: "",
        address: "",
        gender: "",
        image: "",
        email: "",
        _id: "",
        createdAt: "",
      },
      setUser: (newUser: User) => set({ user: newUser }),
    }),
    {
      name: "user-storage",
    }
  )
);

export const useSignUpStore = create<SignUpStoreState>()(
  persist(
    (set) => ({
      userData: {
        firstName: "",
        password: "",
        lastName: "",
        mobile: "",
        address: "",
        gender: "",
        email: "",
        image: "",
        dob: "",
        username: "",
      },
      setUserData: (newData) =>
        set((state) => ({
          userData: {
            ...state.userData,
            ...newData,
          },
        })),
    }),
    {
      name: "SignUp-storage",
    }
  )
);
