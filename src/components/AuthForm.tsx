"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useSearchParams } from "next/navigation";

const Underline = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1283 132"
    className=" max-w-[20rem] w-[30%] mx-auto  fill-primary"
  >
    <path d="M1282.46 5.79c-.91-3.88-5.18-6.65-9.04-5.54-104.37 29.02-193.78 56.87-361.6 74.53-268.41 28.16-539.6 14.6-803.08-26.38C94.9 47.97-.34 26.24.08 41.38c-1.56 14.21 19.47 12.91 29.6 17.24 32.82 8.6 66.1 15.33 99.4 21.81 238.99 44.43 482.98 55.29 725.63 49.01 92.37-4.11 185.68-9.96 275.51-33.09 18.68-6.31 42.79-9.21 55.18-25.89 6.76-13.28-12.41-21.16-13.83-6.12-17.69 11.67-39.31 15.61-59.45 21.34-114.56 25.18-245.31 30.46-361.99 30.36-191.39.45-383.13-10.13-572-42.21 277.31 36.42 560.77 44.96 837.82 2.23 104.21-15.4 195.11-42.74 260.97-61.22a7.57 7.57 0 0 0 5.54-9.05Z"></path>
  </svg>
);

const AuthForm = () => {
  const params = useSearchParams();
  return (
    <div className="flex flex-col items-center   ">
      {Underline}

      <Tabs
        defaultValue={params.get("type") || "login"}
        className="w-[80%] max-w-[30rem] mt-4 mb-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="" value="register">
            Register
          </TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
