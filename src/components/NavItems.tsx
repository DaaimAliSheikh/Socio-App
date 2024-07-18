"use client";
import React, { useCallback, useEffect, useState } from "react";

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
  RefreshCcw,
  LoaderCircle,
} from "lucide-react";
import { Button } from "./ui/button";

import Link from "next/link";
import { User } from "@prisma/client";
import { logoutAction } from "@/actions/auth_actions";
import LogoutButton from "./LogoutButton";
import { redirect } from "next/navigation";
import generateInitials from "@/lib/generateInitials";
import getNotifications from "@/actions/getNotifications";
import { NotificationItem } from "@/lib/types";
import getTimeAgo from "@/lib/getTimeAgo";
import generateNotifContent from "@/lib/generateNotifContent";
import Image from "next/image";

import notifpic from "../../public/no-notifs-pic.svg";
import NotificationDeleteButton from "./NotificationDeleteButton";
import deleteNotification from "@/actions/deleteNotification";

const NavItems = ({ user }: { user: User }) => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = useCallback(async () => {
    const notifs = await getNotifications(user.id);
    setNotifications(notifs);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className=" w-[20em]">
            <h2 className="text-md flex items-center px-2 justify-between">
              Notifications
              <Button
                size={"icon"}
                className="w-8 h-8"
                disabled={refreshDisabled}
                onClick={async () => {
                  setRefreshDisabled(true);
                  await fetchNotifications();
                  setRefreshDisabled(false);
                }}
              >
                {refreshDisabled ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <RefreshCcw size={18} />
                )}
              </Button>
            </h2>
            <ScrollArea className="h-72 mt-2 rounded-none border-none">
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div
                    key={index}
                    className="flex justify-between w-full p-2 rounded-md items-center hover:bg-secondary hover:cursor-pointer "
                  >
                    <div className="w-[20%] flex justify-center items-center">
                      <Avatar>
                        <AvatarImage
                          src={
                            "https://ik.imagekit.io/vmkz9ivsg4" +
                            notif.associate.image
                          }
                        />
                        <AvatarFallback>
                          {generateInitials(notif.associate.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div
                      className={
                        " flex flex-col w-[66%]  px-1  justify-center "
                      }
                    >
                      <h2 className="whitespace-nowrap text-sm overflow-hidden text-ellipsis">
                        {generateNotifContent(notif)}
                      </h2>

                      <p className="text-muted-foreground text-xs">
                        {getTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                    <form
                      action={async () => {
                        await deleteNotification(notif.id);
                        fetchNotifications();
                      }}
                      className=" w-[14%] flex justify-center items-center"
                    >
                      <NotificationDeleteButton />
                    </form>
                  </div>
                ))
              ) : (
                <>
                  <Image
                    className=" mx-auto mt-20"
                    width={100}
                    height={100}
                    alt={"no notifications svg"}
                    src={notifpic}
                  ></Image>
                  <h1 className="text-sm text-muted-foreground text-center mt-6">
                    No notifications!
                  </h1>
                </>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Avatar className=" self-center">
              <AvatarImage
                src={"https://ik.imagekit.io/vmkz9ivsg4" + user.image}
              />
              <AvatarFallback>{generateInitials(user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[15rem] py-2">
            <DropdownMenuItem>
              <p>
                <h2 className="text-1xl font-bold text-start">{user.name}</h2>
                <h3 className="text-sm text-muted-foreground">{user.email}</h3>
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
