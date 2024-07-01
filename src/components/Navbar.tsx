import React from "react";
import Container from "./Container";

import { NavigationMenu } from "@/components/ui/navigation-menu";
import Link from "next/link";
import NavItems from "./NavItems";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { auth } from "@/auth";


const Navbar = async () => {
  const session = await auth();
  console.log("name is ", session?.user?.name);
  return (
    <Container>
      <nav
        className={`sticky top-0 py-3 flex ${
          session?.user ? "justify-between" : "justify-center"
        }`}
      >
        {/*logo*/}

        <Link className="font-bold self-center  text-4xl" href={"/"}>
          <h1 className=" bg-gradient-to-r from-rose-600 to-fuchsia-400 bg-clip-text text-transparent ">
            SOCIO
          </h1>
        </Link>

        {/*navigation links */}

        <NavigationMenu
          className={session?.user ? "md:block hidden" : " hidden"}
        >
          <NavItems />
        </NavigationMenu>
        {session?.user ? (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        ) : null}
      </nav>
    </Container>
  );
};

export default Navbar;
