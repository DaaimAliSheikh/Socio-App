import { NavigationMenu } from "@/components/ui/navigation-menu";
import NavItems from "./NavItems";

import { auth } from "@/auth";
import getUserById from "@/lib/getUserById";
import SideNav from "./SideNav";
import { Card } from "./ui/card";
import getRecentSearches from "@/actions/getRecentSearches";

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

const Navbar = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  const recentSearches = await getRecentSearches(session?.user?.id || "");

  return (
    <nav
      className={`container fixed top-0 py-3  bg-opacity-50 backdrop-blur-md z-10 flex ${
        user ? "justify-between" : "justify-center"
      }`}
    >
      {/*logo*/}

      <a className="font-bold self-center  text-4xl" href={"/"}>
        <h1 className=" bg-gradient-to-r from-rose-600 to-fuchsia-400 bg-clip-text text-transparent ">
          SOCIO
        </h1>
      </a>

      {/*navigation links */}
      {user ? (
        <Card className="border-none shadow-none bg-transparent">
          <NavigationMenu className={user ? "md:block hidden" : " hidden"}>
            <NavItems user={user} recentSearches={recentSearches} />
          </NavigationMenu>

          {user ? (
            <SideNav user={user} recentSearches={recentSearches} />
          ) : null}
        </Card>
      ) : null}
    </nav>
  );
};

export default Navbar;
