"use client";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

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
  Bell,
  CircleUser,
  House,
  Moon,
  Power,
  Settings,
  Sun,
  Users,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";

import Link from "next/link";
import { CommandDialog } from "./ui/command";

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

const NavItems = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink
          onClick={() => setOpen(true)}
          className={navigationMenuTriggerStyle()}
        >
          <Search className="text-primary mr-2 text-2xl" />
          <p>Search</p>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for People or Posts..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Posts">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="People">
            <CommandItem>a</CommandItem>
            <CommandItem>Se</CommandItem>
            <CommandItem>t</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

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
            <Button variant="outline" className=" relative">
              <Bell className="text-primary mr-2 text-2xl" />
              <p>Notifications</p>
              <div className="h-4 w-4 rounded-full bg-primary absolute top-[1px] left-3 border-2 border-background"></div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className=" w-[300px]">
            <ScrollArea className="h-72 w-[290px] rounded-none border-none">
              {notifications.map((notif, index) => (
                <>
                  <div key={index}>
                    <Link href={"/profile"}>
                      <DropdownMenuItem className="w-[270px] ">
                        <li className="w-[270px] text-ellipsis overflow-hidden">
                          {notif}
                        </li>
                      </DropdownMenuItem>
                    </Link>
                    {index !== notifications.length - 1 ? (
                      <DropdownMenuSeparator className="my-1 w-[270px]" />
                    ) : null}
                  </div>
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
  );
};

export default NavItems;
