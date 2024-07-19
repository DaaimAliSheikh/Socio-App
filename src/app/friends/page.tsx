import { auth } from "@/auth";
import FriendsPageResults from "@/components/FriendsPageResults";
import getUserById from "@/lib/getUserById";

import React, { Suspense } from "react";

const friendsPage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  if (!user) return null;

  return (
    <Suspense>
      <FriendsPageResults user={user} />
    </Suspense>
  );
};

export default friendsPage;
