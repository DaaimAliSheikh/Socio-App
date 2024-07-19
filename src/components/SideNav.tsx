"use client";
import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Bell,
  House,
  Menu,
  Moon,
  RefreshCcw,
  Search,
  Sun,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { RecentSearches, User } from "@prisma/client";
import { Card } from "./ui/card";
import Link from "next/link";
import { useTheme } from "next-themes";
import { logoutAction } from "@/actions/auth_actions";
import LogoutButton from "./LogoutButton";
import { redirect } from "next/navigation";
import generateInitials from "@/lib/generateInitials";

const SideNav = ({
  user,
  recentSearches,
}: {
  user: User;
  recentSearches: RecentSearches[];
}) => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const handleSelect = (currentValue: string) => {
    window.location.href = `/search?key=${currentValue}`;
    setSearchOpen(false);
    setSheetOpen(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className=" md:hidden" size={"icon"}>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[70vw]" side={"left"}>
        <Card className="border-none shadow-none bg-transparent">
          <SheetHeader className="mt-2">
            <a href={`/profile/${user.id}`}>
              <SheetClose asChild>
                <Card className="flex  shadow-sm hover:cursor-pointer items-center my-2 w-full group p-2 hover:bg-secondary ">
                  <Avatar className="h-10 w-10 ">
                    <AvatarImage
                      src={
                        (user?.image?.startsWith("/socio")
                          ? "https://ik.imagekit.io/vmkz9ivsg4"
                          : "") + user?.image
                      }
                    />
                    <AvatarFallback>
                      {generateInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 overflow-hidden">
                    <h2 className="text-1xl font-bold text-start">
                      {user.name}
                    </h2>
                    <h3 className="text-sm text-muted-foreground">
                      {user.email}
                    </h3>
                  </div>
                </Card>
              </SheetClose>
            </a>

            <ul>
              <li>
                <a href="/">
                  <SheetClose asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full flex text-foreground justify-start my-3 border"
                    >
                      <House className="text-primary mr-2 text-2xl" />
                      <p>Home</p>
                    </Button>
                  </SheetClose>
                </a>
              </li>

              <li>
                <Button
                  variant={"ghost"}
                  className="w-full flex justify-start my-3 border"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="text-primary mr-2 text-2xl" />
                  <p>Search</p>
                </Button>
                <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                  <CommandInput
                    value={inputValue}
                    onValueChange={(value) => {
                      setInputValue(value);
                    }}
                    placeholder="Search for People or Posts..."
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {inputValue && (
                      <CommandGroup heading="Search results for:">
                        <CommandItem onSelect={() => handleSelect(inputValue)}>
                        &quot;{inputValue}&quot;
                        </CommandItem>
                      </CommandGroup>
                    )}
                    <CommandSeparator />

                    <CommandGroup heading="Recent searches">
                      {recentSearches?.map((recent) => (
                        <CommandItem
                          key={recent.id}
                          onSelect={() => handleSelect(recent.search)}
                        >
                          <div className="flex">
                            <RefreshCcw size={15} className="mr-2" />
                            <p>{recent.search}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </li>
              <li>
                <a href="/friends">
                  <SheetClose asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full flex justify-start my-3 border relative"
                    >
                      <Users className="text-primary mr-2 text-2xl" />
                      <p>Friends</p>
                    </Button>
                  </SheetClose>
                </a>
              </li>
              <li>
                <a href={"/notifications"}>
                  <SheetClose asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full flex justify-start my-3 border relative"
                    >
                      <Bell className="text-primary mr-2 text-2xl" />
                      <p>Notifications</p>
                    </Button>
                  </SheetClose>
                </a>
              </li>
              <li>
                <SheetClose asChild>
                  <Button
                    variant={"ghost"}
                    className="w-full flex justify-start my-3 border"
                    onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
                  >
                    {theme == "dark" ? (
                      <Moon className="text-primary mr-4" />
                    ) : (
                      <Sun className="text-primary mr-4" />
                    )}

                    <p>Mode: {theme}</p>
                  </Button>
                </SheetClose>
              </li>
              <li>
                <form
                  action={async () => {
                    await logoutAction();
                    window.location.href = "/signin";
                  }}
                >
                  <LogoutButton />
                </form>
              </li>
            </ul>
          </SheetHeader>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default SideNav;
