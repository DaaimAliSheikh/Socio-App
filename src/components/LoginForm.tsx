"use client";

import React, { useCallback, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { signIn } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FcGoogle } from "react-icons/fc";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { LoginFormSchema, LoginFormType } from "@/lib/LoginFormSchema";
import { signInRedirectUrl } from "@/routes";
import { loginAction } from "@/actions/auth_actions";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import { LoaderCircle } from "lucide-react";

const LoginForm = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = useCallback(async (data: LoginFormType) => {
    const result = await loginAction(data);

    if (result?.error) {
      setErrorMsg(result.error);
      setSuccessMsg(null);
    } else if (result?.success) {
      setSuccessMsg(result.success);
      setErrorMsg(null);
    } else if (result?.loggedIn) {
      window.location.href = signInRedirectUrl;
    }
  }, []);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Card>
      <CardContent className="mt-4 r">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="xyz@example.com" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMsg ? <ErrorAlert>{errorMsg}</ErrorAlert> : null}
            {successMsg ? <SuccessAlert>{successMsg}</SuccessAlert> : null}

            <Button
              disabled={form.formState.isSubmitting}
              className=" w-full text-foreground hover:bg-primary-foreground"
              type="submit"
            >
              Login
              {form.formState.isSubmitting ? (
                <LoaderCircle className="animate-spin ml-2" />
              ) : null}
            </Button>

            <div className="flex items-center w-full">
              <Separator className="w-[45%] mr-2" />
              <p className="text-muted-foreground">or</p>
              <Separator className="w-[45%] ml-2" />
            </div>
            <Button
              onClick={(e) =>
                signIn("google", { callbackUrl: signInRedirectUrl })
              }
              variant={"secondary"}
              type="button"
            >
              <FcGoogle className=" text-2xl mr-2 " />
              <p>Sign in with Google</p>
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <a
          href="/signin?type=register"
          className=" mx-auto text-muted-foreground hover:underline "
        >
          Don&rsquo;t have an account?
        </a>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
