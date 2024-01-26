import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import image from "../../assets/image-plus.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { format } from "date-fns";

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
  useSignup,
  useVerifyOTP,
  useresetOTP,
} from "@/api/userdetails";
import { useRef, useState } from "react";
import {
  AlertOctagon,
  CheckCheck,
  Eye,
  EyeOff,
  Loader,
  Undo2,
  CalendarIcon,
  PencilLine,
} from "lucide-react";
import { cn, passwordSchema } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSignUpStore } from "@/store/useUser";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Email must be a valid email address",
    }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const detailsSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  address: z.string().min(2, { message: "Address is required" }),
  dob: z.string().min(2, { message: "Date of birth is required" }),
  gender: z.string().min(2, { message: "Gender is required" }),
});

const mobileSchema = z.object({
  mobile: z.string().min(10, { message: "Mobile number is required" }),
  countryCode: z.string().min(2, { message: "Country code is required" }),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: "OTP is required" }),
});

const usernameSchema = z.object({
  username: z.string().min(2, { message: "Username is required" }),
  image: z.string().min(2, { message: "Image is required" }),
});

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const next = () => setStep((prevStep) => prevStep + 1);
  const back = () => setStep((prevStep) => prevStep - 1);

  return (
    <>
      <div>
        <Link
          to="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 bg-accent/50"
          )}
        >
          Login
        </Link>
      </div>
      <AnimatePresence>
        {step === 1 && <FormStep1 next={next} setEmail={setEmail} />}
        {step === 2 && <FormStep2 next={next} back={back} email={email} />}
        {step === 3 && <FormStep3 next={next} back={back} />}
        {step === 4 && <FormStep4 next={next} back={back} />}
        {step === 5 && <FormStep5 next={next} back={back} />}
        {step === 6 && <FormStep6 />}
      </AnimatePresence>
    </>
  );
};

const FormStep1 = ({
  next,
  setEmail,
}: {
  next: () => void;
  setEmail: (email: string) => void;
}) => {
  const [networkError, setNetworkError] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const {
    isLoading: checkingEmail,
    mutateAsync: mutateAsyncEmailCheck,
    data,
  } = useEmailCheck();
  const { setUserData } = useSignUpStore();

  const { isLoading: generatingOTP, mutateAsync } = useGenerateOTP();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const {
    formState: { errors },
  } = form;

  const callApi = async (email: string) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }

    if (email === "") {
      return;
    }
    try {
      await mutateAsyncEmailCheck({ email });
    } catch (error) {
      toast.error("Email already exists, try another one");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }

    if (data === undefined) {
      toast.error("Email used exists, try another one");
      return;
    }

    try {
      const res = await mutateAsync({ email: values.email });
      toast.success(res.data.message);
      setEmail(values.email);

      setUserData({
        email: values.email,
        password: values.password,
      });

      next();
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-base text-muted-foreground">
            Fill in your credentials below.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Please note password must be atleast{" "}
            <span className="font-bold">8</span>, contain atleast{" "}
            <span className="font-bold">1</span> uppercase,
            <span className="font-bold">1</span> lowercase,{" "}
            <span className="font-bold">1</span> number and{" "}
            <span className="font-bold">1</span> special character.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      {...field}
                      onBlur={(event) => {
                        field.onBlur();
                        callApi(event.target.value);
                      }}
                    />
                  </FormControl>
                  <div className="absolute top-[22%] right-0 pr-2 pointer-events-none">
                    {checkingEmail ? <Loader className="animate-spin" /> : null}
                  </div>
                  {data ? (
                    <div className="absolute top-[22%] right-0 mr-2 rounded-full pointer-events-none">
                      <CheckCheck className="h-5 w-5" />
                    </div>
                  ) : null}
                </div>
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
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="********"
                      type={seePassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute top-[25%] right-0 mr-2 cursor-pointer">
                    {seePassword ? (
                      <EyeOff
                        className="h-5 w-5"
                        onClick={() => setSeePassword(false)}
                      />
                    ) : (
                      <Eye
                        className=" h-5 w-5"
                        onClick={() => setSeePassword(true)}
                      />
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="********"
                      type={seeConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute top-[25%] right-0 mr-2 cursor-pointer">
                    {seeConfirmPassword ? (
                      <EyeOff
                        className="h-5 w-5"
                        onClick={() => setSeeConfirmPassword(false)}
                      />
                    ) : (
                      <Eye
                        className=" h-5 w-5"
                        onClick={() => setSeeConfirmPassword(true)}
                      />
                    )}
                  </div>
                </div>
                {errors.confirmPassword && (
                  <FormMessage>{errors.confirmPassword.message}</FormMessage>
                )}
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
          <Button
            disabled={
              checkingEmail ||
              generatingOTP ||
              !!errors.confirmPassword ||
              !!errors.email ||
              !!errors.password
            }
            className="w-full"
            type="submit"
          >
            Next
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

const FormStep2 = ({
  next,
  back,
  email,
}: {
  next: () => void;
  back: () => void;
  email: string;
}) => {
  const [networkError, setNetworkError] = useState("");
  const { isLoading, mutateAsync, data } = useVerifyOTP();
  const { isLoading: resendingOTP, mutateAsync: OTPAsync } = useresetOTP();
  const [isResendDisabled, setResendDisabled] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });

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

  const onSubmit = async (values: z.infer<typeof otpSchema>) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }

    if (values.otp) {
      try {
        const res = await mutateAsync({ email, otp: Number(values.otp) });
        toast.success(res.data.message);

        next();
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
          <p className="text-sm text-muted-foreground">
            Please enter the OTP sent to {email}.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>OTP</FormLabel>
                  <Input
                    {...field}
                    placeholder="Enter OTP"
                    type="number"
                    autoComplete="phone"
                  />
                </FormItem>
              )}
            />
            <div className="absolute top-[50%] right-0 pr-2 pointer-events-none">
              {isLoading ? <Loader className="animate-spin" /> : null}
            </div>
            {data ? (
              <div className="absolute top-[16%] right-0 bg-green-300 p-1 mr-2 rounded-full pointer-events-none">
                <CheckCheck className="text-white h-5 w-5" />
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
              {resendingOTP ? (
                <Loader className="animate-spin" />
              ) : (
                "Resend OTP"
              )}
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
            disabled={isLoading || resendingOTP}
            className="w-full mt-4"
            type="submit"
          >
            Next
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

const FormStep3 = ({ next, back }: { next: () => void; back: () => void }) => {
  const [networkError, setNetworkError] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { setUserData } = useSignUpStore();

  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
  });

  const { setValue } = form;

  const handleDateChange = (date: Date | null) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    setDate(dateString);
    setValue("dob", dateString, { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof detailsSchema>) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }
    if (values.dob === null) {
      toast.error("Please select your date of birth");
      return;
    }
    setUserData({
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      dob: values.dob,
      gender: values.gender,
    });
    console.log(values);
    next();
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Tell us more about yourself
          </h1>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      type="text"
                      autoComplete="name"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Street name, building number, apartment number."
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <div className="relative">
                    <DatePicker
                      closeOnScroll={(e) => e.target === document}
                      selected={date ? new Date(date) : null}
                      onChange={(date: Date) => handleDateChange(date)}
                      isClearable
                      placeholderText="Select date"
                      className="border border-gray-300 rounded-md py-1.5 pl-8 "
                      dateFormat="MMMM d, yyyy"
                    />
                    <div className="absolute top-[18%] left-0 pl-1.5">
                      <CalendarIcon />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
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
          <Button className="w-full" type="submit">
            Next
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
const FormStep4 = ({ next, back }: { next: () => void; back: () => void }) => {
  const { setUserData } = useSignUpStore();

  const form = useForm<z.infer<typeof mobileSchema>>({
    resolver: zodResolver(mobileSchema),
  });
  const [networkError, setNetworkError] = useState<string>("");

  const onSubmit = async (values: z.infer<typeof mobileSchema>) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }
    setUserData({
      mobile: values.mobile,
    });
    console.log(values);
    next();
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Input Phone Number
          </h1>
          <p className="text-sm text-muted-foreground">
            We will send you a verification code to your phone number.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-1">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem className="flex flex-col w-[100px]">
                  <FormLabel>Code</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nigeria">+234</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    {...field}
                    placeholder="8011111111"
                    type="Number"
                    autoComplete="phone"
                  />
                </FormItem>
              )}
            />
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
          <Button className="w-full" type="submit">
            Next
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
const FormStep5 = ({ next, back }: { next: () => void; back: () => void }) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string>("");

  const { setUserData } = useSignUpStore();
  const currentState = useSignUpStore.getState();

  const { isLoading, mutateAsync } = useSignup();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
  });

  const { setValue } = form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setAvatar(image);
      setValue("image", image, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof usernameSchema>) => {
    setNetworkError("");
    if (!navigator.onLine) {
      setNetworkError(
        "Your internet connection might be offline. check and try again"
      );
      return;
    }
    setUserData({
      username: values.username,
      image: values.image,
    });
    console.log(currentState.userData);

    await mutateAsync(currentState.userData);
    next();
  };

  console.log(avatar);

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
          <h1 className="text-2xl font-semibold tracking-tight">
            Input user image and username
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in your credentials below to create your account
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full flex justify-center items-center">
            <div className="relative">
              <img
                src={avatar || "avatar"}
                alt="Avatar"
                className="w-[150px] h-[150px] rounded-full border-2 border-gray-200"
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <button
                type="button"
                className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-600 border border-gray-800"
                onClick={handleIconClick}
              >
                <PencilLine size={20} color="#fff" />
              </button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>@Username</FormLabel>
                <Input
                  className="w-full"
                  {...field}
                  placeholder="@Joey"
                  type="text"
                  autoComplete="phone"
                />
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
          <Button disabled={isLoading} className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
const FormStep6 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            We have created your profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Please proceed to with the link bellow to login.
          </p>
        </div>
      </div>
      <Link to={"/login"}>
        <Button variant={"link"}>Login</Button>
      </Link>
    </motion.div>
  );
};

export default SignUpForm;
