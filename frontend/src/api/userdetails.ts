import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

type SignupPayload = {
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const useSignup = () => {
  const mutationFn = async (payload: SignupPayload) => {
    const data = payload;

    return await axios.post(
      "http://localhost:4000/api/user/signup",
      data,
      config
    );
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const useLogin = () => {
  const mutationFn = async (payload: LoginPayload) => {
    const data = payload;

    return await axios.post(
      "http://localhost:4000/api/user/login",
      data,
      config
    );
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};
