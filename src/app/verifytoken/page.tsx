import EmailVerificationCard from "@/components/EmailVerificationCard";
import { Suspense } from "react";

const EmailVerificationPage = () => {
  return (
    <Suspense>
      <EmailVerificationCard />;
    </Suspense>
  );
};

export default EmailVerificationPage;
