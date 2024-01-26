import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useEmailCheck,
  useGenerateOTP,
  useLogin,
  useLoginWithoutPassword,
  useVerifyOTP,
  useresetOTP,
  verifyLoginEmail,
} from "@/api/userdetails";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { AlertOctagon, CheckCheck, Loader, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "../ui/label";
import { useUserStore } from "@/store/useUser";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[\W_]/, { message: "Password must contain at least one symbol" });

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const noPasswordSchema = z.object({
  email: z.string().email(),
});

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const next = () => setStep((prevStep) => prevStep + 1);
  const back = () => setStep((prevStep) => prevStep - 1);

  return (
    <>
      <div>
        <Link
          to="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 bg-accent/50"
          )}
        >
          Create an account
        </Link>
      </div>
      <AnimatePresence>
        {step === 1 && <LoginWithPassword next={next} />}
        {step === 2 && (
          <LoginWithoutPassword next={next} back={back} setEmail={setEmail} />
        )}
        {step === 3 && <VerifyOTP back={back} email={email} />}
      </AnimatePresence>
    </>
  );
};

const LoginWithPassword = ({ next }: { next: () => void }) => {
  const [networkError, setNetworkError] = useState("");
  const { mutateAsync, isLoading } = useLogin();
  const Navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }
    try {
      const response = await mutateAsync(values);

      setUser(response.data.user);
      toast.success(response.data.message);
      Navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data;
        if (serverError && serverError.details) {
          toast.error(serverError.details);
        } else {
          console.error("An unexpected error occurred:", error.message);
        }
      } else {
        console.error("An error occurred:", error);
      }
    }
  };
  return (
    <motion.div>
      <div className="flex flex-col space-y-2 text-center mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Enter your email and password below to login.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="example@gmail.com"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      {...field}
                    />
                    <div className="absolute top-[22%] right-0 pr-2 pointer-events-none">
                      {isLoading ? <Loader className="animate-spin" /> : null}
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="********" type="password" {...field} />
                    <div className="absolute top-[22%] right-0 pr-2 pointer-events-none">
                      {isLoading ? <Loader className="animate-spin" /> : null}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end items-center">
            <Button className="px-0" variant={"link"}>
              Forgot Password?
            </Button>
          </div>
          {networkError && (
            <div className="flex items-center rounded-md gap-2 text-[#F7685B] bg-[#FFDBDB] px-3 py-3 text-center mt-2">
              <AlertOctagon />
              {networkError ? (
                <div className="flex flex-col items-start font-bold text-xs">
                  <p>Your connection might be offline.</p>
                  <p> Please, check and try again</p>
                </div>
              ) : null}
            </div>
          )}
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "logging in..." : "Login"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant={"ghost"}
            disabled={isLoading}
            onClick={next}
            className="w-full bg-accent/50"
          >
            Login without password
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
const LoginWithoutPassword = ({
  back,
  next,
  setEmail,
}: {
  back: () => void;
  next: () => void;
  setEmail: (email: string) => void;
}) => {
  const [networkError, setNetworkError] = useState("");
  const { isLoading: generatingOTP, mutateAsync } = useGenerateOTP();
  const { isLoading: checkingEmail, mutateAsync: mutateAsyncEmailCheck } =
    verifyLoginEmail();

  type FormValues = z.infer<typeof noPasswordSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(noPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }

    try {
      const emailCheck = await mutateAsyncEmailCheck({ email: values.email });

      if (emailCheck.status === 200) {
        const res = await mutateAsync({ email: values.email });
        toast.success(res.data.message);
        setEmail(values.email);
        next();
      } else {
        toast.error(emailCheck.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data;
        if (serverError && serverError.error) {
          toast.error(serverError.error);
        } else {
          console.error("An unexpected error occurred:", error.message);
        }
      } else {
        console.error("An error occurred:", error);
      }
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Enter your email to receive a one-time password for login.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="example@gmail.com"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      {...field}
                    />
                    <div className="absolute top-[22%] right-0 pr-2 pointer-events-none">
                      {checkingEmail ? (
                        <Loader className="animate-spin" />
                      ) : null}
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {networkError && (
            <div className="flex items-center rounded-md gap-2 text-[#F7685B] bg-[#FFDBDB] px-3 py-3 text-center mt-2">
              <AlertOctagon />
              {networkError ? (
                <div className="flex flex-col items-start font-bold text-xs">
                  <p>Your connection might be offline.</p>
                  <p> Please, check and try again</p>
                </div>
              ) : null}
            </div>
          )}
          <Button disabled={generatingOTP} className="w-full" type="submit">
            {generatingOTP ? "Sending OTP..." : "Login"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant={"ghost"}
            disabled={generatingOTP}
            onClick={back}
            className="w-full bg-accent/50"
          >
            Login with password
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

const VerifyOTP = ({ back, email }: { back: () => void; email: string }) => {
  const { isLoading, mutateAsync, data } = useLoginWithoutPassword();
  const { isLoading: resendingOTP, mutateAsync: OTPAsync } = useresetOTP();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isResendDisabled, setResendDisabled] = useState(false);
  const [networkError, setNetworkError] = useState("");
  const [otp, setOTP] = useState<number | undefined>();

  const onResndOTP = async () => {
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }
    try {
      setResendDisabled(true);
      const res = await OTPAsync({ email });
      toast.success(res.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else {
        console.error("An error occurred:", error);
      }
    }
    setTimeout(() => {
      setResendDisabled(false);
    }, 3 * 60 * 1000);
  };

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }

    if (otp) {
      try {
        const res = await mutateAsync({ email, otp: Number(otp) });
        toast.success(res.data.message);
        Navigate("/dashboard");
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.error);
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button variant={"link"} className="flex gap-2 mb-10" onClick={back}>
        <Undo2 />
        Back
      </Button>
      <div>
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Verify OTP</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Please enter the OTP sent to {email}.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Label>OTP</Label>
          <input
            className="w-full rounded-md p-2 border-2 border-accent/50 focus:border-accent/75"
            placeholder="Enter OTP"
            type="number"
            autoFocus
            onChange={(e) => {
              const otpValue = Number(e.target.value);
              if (otpValue.toString().length === 6) {
                setLoading(false);
              } else {
                setLoading(true);
              }
              setOTP(otpValue);
            }}
          />
          <div className="absolute top-[50%] right-0 pr-2 pointer-events-none">
            {isLoading ? <Loader className="animate-spin" /> : null}
          </div>
          {data ? (
            <div className="absolute top-[52%] right-0 mr-2 rounded-full pointer-events-none">
              <CheckCheck className="h-5 w-5" />
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-end">
          <Button
            disabled={isResendDisabled}
            onClick={onResndOTP}
            className="pr-0"
            variant={"link"}
          >
            {resendingOTP ? <Loader className="animate-spin" /> : "Resend OTP"}
          </Button>
        </div>

        {networkError && (
          <div className="flex items-center rounded-md gap-2 text-[#F7685B] bg-[#FFDBDB] px-3 py-3 text-center mt-2">
            <AlertOctagon />
            {networkError ? (
              <div className="flex flex-col items-start font-bold text-xs">
                <p>Your connection might be offline.</p>
                <p> Please, check and try again</p>
              </div>
            ) : null}
          </div>
        )}
        <Button
          disabled={isLoading || loading || resendingOTP}
          className="w-full mt-4"
          type="submit"
        >
          Next
        </Button>
      </form>
    </motion.div>
  );
};

export default LoginForm;
