import EmailVerificationCard from "@/components/EmailVerificationCard";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const EmailVerificationPage = () => {
  return (
    <Suspense>
      <EmailVerificationCard />
    </Suspense>
  );
};

export default EmailVerificationPage;
