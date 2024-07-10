"use client";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandDialog,
} from "@/components/ui/command";

import {
  Bell,
  CircleUser,
  House,
  Moon,
  Power,
  Settings,
  Sun,
  Users,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";

import Link from "next/link";
import { User } from "@prisma/client";
import { logoutAction } from "@/actions/auth_actions";
import LogoutButton from "./LogoutButton";
import { redirect } from "next/navigation";

const notifications = [
  {
    person: "dada",
    type: "likawdwadwadawdsadwdsawdasdawdawwde",
    date: "toawdadwadawdawdsawdaswdawdawdday",
  },
  {
    person: "dada",
    type: "likawdwadwadawdsadwdsawdasdawdawwde",
    date: "toawdadwadawdawdsawdaswdawdawdday",
  },
  {
    person: "dada",
    type: "likawdwadwadawdsadwdsawdasdawdawwde",
    date: "toawdadwadawdawdsawdaswdawdawdday",
  },
  {
    person: "dada",
    type: "likawdwadwadawdsadwdsawdasdawdawwde",
    date: "toawdadwadawdawdsawdaswdawdawdday",
  },
  {
    person: "dada",
    type: "likawdwadwadawdsadwdsawdasdawdawwde",
    date: "toawdadwadawdawdsawdaswdawdawdday",
  },
  {
    person: "dada",
    type: "likawdwadwadawdsadwdsawdasdawdawwde",
    date: "toawdadwadawdawdsawdaswdawdawdday",
  },
];

type NavItemsProps = {
  user: User | null;
};

const NavItems = ({ user }: NavItemsProps) => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => setSearchOpen(true)}
          className={navigationMenuTriggerStyle()}
        >
          <Search className="text-primary  mr-2 text-2xl" />
          <p>Search</p>
        </NavigationMenuLink>

        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder="Search for People or Posts..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Recent Searches">
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>a</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link href="/friends" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Users className="text-primary mr-2 text-2xl" />
            <p>Friends</p>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link href="/" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <House className="text-primary mr-2 text-2xl" />
            <p>Home</p>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem className="pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant="outline" className=" relative">
              <Bell className="text-primary mr-2 text-2xl" />
              <p>Notifications</p>
              <div className="h-4 w-4 rounded-full bg-primary absolute top-[1px] left-2 border-2 border-background"></div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className=" w-[20em]">
            <ScrollArea className="h-72 rounded-none border-none">
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  className="flex rounded-md justify-between w-[calc(100%-7rem)]  items-center hover:bg-secondary hover:cursor-pointer "
                >
                  <div className="flex  overflow-hidden">
                    <Avatar className=" m-2 h-10 w-10 border-1">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div
                      className={" ml-2 flex flex-col w-[70%]  justify-center "}
                    >
                      <h2
                        className={
                          "justify-center text-sm font-bold overflow-hidden  text-ellipsis"
                        }
                      >
                        {notif.type}
                      </h2>

                      <p className="text-xs text-muted-foreground overflow-hidden  text-ellipsis">
                        {notif?.date}
                      </p>
                    </div>
                  </div>
                  <Button size={"icon"} className="mr-1 ">
                    <Trash2 size={22} />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Avatar className=" self-center">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[15rem] py-2">
            <DropdownMenuItem>
              <p>
                <h2 className="text-1xl font-bold text-start">{user?.name}</h2>
                <h3 className="text-sm text-muted-foreground">{user?.email}</h3>
              </p>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />
            <Button
              variant={"ghost"}
              className="w-full flex justify-start my-3 border"
              type="button"
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
            >
              {theme == "dark" ? (
                <Moon className="text-primary mr-4" />
              ) : (
                <Sun className="text-primary mr-4" />
              )}

              <p>Mode: {theme}</p>
            </Button>
            <form
              className="w-full  "
              action={async () => {
                await logoutAction();
                redirect("/signin");
              }}
            >
              <LogoutButton />
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
};

export default NavItems;
