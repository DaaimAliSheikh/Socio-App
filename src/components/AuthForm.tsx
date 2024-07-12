"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const AuthForm = () => {
  return (
    <Tabs defaultValue={"login"} className="w-full max-w-[30rem] mt-4 mb-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
