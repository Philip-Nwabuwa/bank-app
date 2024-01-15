import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/api/userdetails";
import { useAuthContext } from "@/hooks/useAuthContext";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { dispatch } = useAuthContext();
  const { isLoading, mutateAsync } = useLogin();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await mutateAsync(values);
      console.log(result.data);
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", result.data.user.email);
      // update AuthContext
      dispatch({
        type: "LOGIN",
        payload: result.data.user,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.details);
      } else {
        console.error(error);
      }
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    {...field}
                  />
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
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
