"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, RegisterFormType } from "@/lib/RegisterFormSchema";
import { useForm } from "react-hook-form";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { registerAction } from "@/actions/auth_actions";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import OAuthForm from "./OAuthForm";

const RegisterForm = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const params = useSearchParams();

  useEffect(() => {
    if (params) {
      if (params.get("error") === "OAuthAccountNotLinked") {
        setSuccessMsg(null);
        setErrorMsg("Email already registered with a different provider");
      }
    }
  }, [params]);

  const form = useForm<RegisterFormType>({
    shouldUnregister: false,
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (data: RegisterFormType) => {
    const result = await registerAction(data);
    if (result?.error) {
      setErrorMsg(result.error);
      setSuccessMsg(null);
    } else if (result?.success) {
      setSuccessMsg(result.success);
      setErrorMsg(null);
    }
  }, []);

  return (
    <Card>
      <CardContent className="mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 flex flex-col"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              Register
              {form.formState.isSubmitting ? (
                <LoaderCircle className="animate-spin ml-2" />
              ) : null}
            </Button>

            <div className="flex items-center w-full">
              <Separator className="w-[45%] mr-2" />
              <p className="text-muted-foreground">or</p>
              <Separator className="w-[45%] ml-2" />
            </div>
          </form>
        </Form>
        <OAuthForm />
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
