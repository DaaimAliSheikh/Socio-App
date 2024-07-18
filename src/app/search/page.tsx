import { auth } from "@/auth";
import SearchResults from "@/components/SearchResults";
import getUserById from "@/lib/getUserById";

import React, { Suspense } from "react";

const SearchPage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  if (!user) return null;
  
  return (
    <Suspense>
      <SearchResults user={user} />
    </Suspense>
  );
};

export default SearchPage;
