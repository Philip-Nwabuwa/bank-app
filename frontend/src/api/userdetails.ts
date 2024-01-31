import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export type SignupPayload = {
  email?: string;
  password?: string;
  image?: string;
  dob?: string;
  gender?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  username?: string;
  mobile?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type EmailCheckPayload = {
  email: string;
};

type OTPPayload = {
  email: string;
  otp: number;
};

export const useSignup = () => {
  const mutationFn = async (payload: SignupPayload) => {
    const data = payload;

    return await axios.post("/api/user/signup", data, config);
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

    return await axios.post("/api/user/login", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const useLoginWithoutPassword = () => {
  const mutationFn = async (payload: OTPPayload) => {
    const data = payload;

    return await axios.post("/api/user/loginwithoutPassword", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const useEmailCheck = () => {
  const mutationFn = async (payload: EmailCheckPayload) => {
    const data = payload;

    return await axios.post("/api/user/emailcheck", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const verifyLoginEmail = () => {
  const mutationFn = async (payload: EmailCheckPayload) => {
    const data = payload;

    return await axios.post("/api/user/verifyLoginEmail", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const useresetOTP = () => {
  const mutationFn = async (payload: EmailCheckPayload) => {
    const data = payload;

    return await axios.post("/api/user/resetOTP", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};
export const useVerifyOTP = () => {
  const mutationFn = async (payload: OTPPayload) => {
    const data = payload;

    return await axios.post("/api/user/verifyOTP", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const useGenerateOTP = () => {
  const mutationFn = async (payload: EmailCheckPayload) => {
    const data = payload;

    return await axios.post("/api/user/generateotp", data, config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    data,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading, data };
};

export const useLogout = () => {
  const mutationFn = async () => {
    return await axios.post("/api/user/logout", config);
  };
  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
  } = useMutation({ mutationFn: mutationFn });

  return { mutate, mutateAsync, isLoading };
};

export const useGetuser = () => {
  const queryFn = async () => {
    return await axios.post("api/user/logout");
  };
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["logout"],
    queryFn: queryFn,
  });

  return { data, refetch, isLoading };
};

export const useVerifyAuth = () => {
  const queryFn = async () => {
    try {
      const response = await axios.get("/api/account/verify");
      console.log(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { refetch, isSuccess, isLoading, error, data } = useQuery({
    queryKey: ["verifyAuth"],
    queryFn: queryFn,
    retry: false,
  });

  return { refetch, isLoading, isSuccess, error, data };
};
