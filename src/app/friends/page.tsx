import getSuggestedUsers from "@/actions/getSuggestedUsers";
import getUsersBySearchTerm from "@/actions/getUsersBySearchTerm";
import { auth } from "@/auth";
import FriendsPageResults from "@/components/FriendsPageResults";
import SuggestedUsers from "@/components/SuggestedUsers";
import getUserById from "@/lib/getUserById";

import React, { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const friendsPage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  if (!user) return null;
  const suggestedUsers = await getSuggestedUsers(user.id);

  return (
    <>
      <Suspense>
        <FriendsPageResults fullHeight={suggestedUsers.length === 0} suggestedUsers={suggestedUsers} user={user} />
      </Suspense>
      {suggestedUsers.length > 0 && <SuggestedUsers users={suggestedUsers} />}
    </>
  );
};

export default friendsPage;
