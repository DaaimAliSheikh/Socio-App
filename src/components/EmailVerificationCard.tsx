"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import verifyEmail from "@/actions/verifyEmail";
import Link from "next/link";
const EmailVerificationCard = () => {
  const params = useSearchParams();
  const token = params.get("token");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          setIsValid(await verifyEmail(token));
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [token]);

  return (
    <Card className="mx-auto p-6 text-center w-fit">
      <h1 className="text-3xl text-center mb-6">
        {isValid ? "Your Email has been verified!" : "oops! Invalid Token"}
      </h1>
      <Link href={"/signin"}>
        <Button variant={"outline"}>
          <ChevronLeft className="mr-2" />
          Back to Login
        </Button>
      </Link>
    </Card>
  );
};

export default EmailVerificationCard;
