import { NavigationMenu } from "@/components/ui/navigation-menu";
import Link from "next/link";
import NavItems from "./NavItems";

import { auth } from "@/auth";
import getUserById from "@/lib/getUserById";
import SideNav from "./SideNav";
import { Card } from "./ui/card";

const Navbar = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);

  return (
    <nav
      className={`container fixed top-0 py-3  bg-opacity-50 backdrop-blur-md z-10 flex ${
        user ? "justify-between" : "justify-center"
      }`}
    >
      {/*logo*/}

      <Link className="font-bold self-center  text-4xl" href={"/"}>
        <h1 className=" bg-gradient-to-r from-rose-600 to-fuchsia-400 bg-clip-text text-transparent ">
          SOCIO
        </h1>
      </Link>

      {/*navigation links */}
      {user ? (
        <Card className="border-none shadow-none bg-transparent">
          <NavigationMenu className={user ? "md:block hidden" : " hidden"}>
            <NavItems user={user} />
          </NavigationMenu>

          {user ? <SideNav user={user} /> : null}
        </Card>
      ) : null}
    </nav>
  );
};

export default Navbar;
