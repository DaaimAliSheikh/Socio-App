"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import { RefreshCcw } from "lucide-react";

const NotificationsRefresh = () => {
  const router = useRouter();
  return (
    <Button size={"icon"} className="h-8 w-8" onClick={() => router.refresh()}>
      <RefreshCcw size={20} />
    </Button>
  );
};

export default NotificationsRefresh;
