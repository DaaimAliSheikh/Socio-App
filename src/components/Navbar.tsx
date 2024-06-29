"use client";
import React from "react";
import Container from "./Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

import {
  Bell,
  CircleUser,
  House,
  Moon,
  Power,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

const notifications: string[] = [
  "1awdawdawdwadawdwaddadscaawdwadawdsawdwada",
  "2",
  "1",
  "2",
  "1",
  "2",
  "1",
  "2",
  "1",
  "2",
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Container>
      <nav className="sticky top-0 py-3 flex justify-between">
        <Link className="font-bold self-center  text-2xl" href={"/"}>
          <h1 className="text-primary">SOCIO</h1>
        </Link>

        <NavigationMenu className="sm:block  hidden">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/friends" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <p>Friends</p>
                  <Users className="text-primary ml-2 text-2xl" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <p>Home</p>
                  <House className="text-primary ml-2 text-2xl" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <p>Notifications</p>
                    <Bell className="text-primary ml-2 text-2xl" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className=" w-[300px]">
                  <ScrollArea className="h-72 w-[290px] rounded-none border-none">
                    {notifications.map((notif, index: number) => (
                      <>
                        <Link href={"/profile"} key={index}>
                          <DropdownMenuItem className="w-[270px] ">
                            <li className="w-[270px] text-ellipsis overflow-hidden">
                              {notif}
                            </li>
                          </DropdownMenuItem>
                        </Link>
                        {index !== notifications.length - 1 ? (
                          <DropdownMenuSeparator className="my-1 w-[270px]" />
                        ) : null}
                      </>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <Link href={"/profile"}>
                    <DropdownMenuItem>
                      <CircleUser className="text-primary mr-4" />
                      <p>Profile</p>
                    </DropdownMenuItem>
                  </Link>

                  <Link href={"/profile"}>
                    <DropdownMenuItem>
                      <Settings className="text-primary mr-4" />
                      <p>Settings</p>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
                  >
                    {theme == "dark" ? (
                      <Moon className="text-primary mr-4" />
                    ) : (
                      <Sun className="text-primary mr-4" />
                    )}

                    <p>Mode: {theme}</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Power className="text-primary mr-4" />
                    <p>Log out</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </Container>
  );
};

export default Navbar;
