import { Card } from "@/components/ui/card";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import NotificationsRefresh from "@/components/NotificationsRefresh";
import getNotifications from "@/actions/getNotifications";
import generateInitials from "@/lib/generateInitials";
import getTimeAgo from "@/lib/getTimeAgo";
import { NotificationItem } from "@/lib/types";
import generateNotifContent from "@/lib/generateNotifContent";
import notifpic from "../../../public/no-notifs-pic.svg";

import Image from "next/image";
import deleteNotification from "@/actions/deleteNotification";
import NotificationDeleteButton from "@/components/NotificationDeleteButton";
import Link from "next/link";
import { auth } from "@/auth";
import getUserById from "@/lib/getUserById";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const NotificationsPage = async () => {
  ///retrieve the notifications from the database server action
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  if (!user) return null;
  const notifications: NotificationItem[] = await getNotifications(user.id);

  return (
    <main className="flex items-start flex-col  w-[90%] mx-auto  max-w-[40rem]">
      <div className="text-md flex w-full justify-between items-center text-muted-foreground font-bold my-2">
        Notifications
        <NotificationsRefresh />
      </div>
      <ul className="w-full">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => {
            return (
              <Card
                key={index}
                className="flex  w-full items-center hover:bg-secondary hover:cursor-pointer "
              >
                <div className="w-[15%] md:w-[10%]  flex justify-center items-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        (notif.associate?.image?.startsWith("/socio")
                          ? "https://ik.imagekit.io/vmkz9ivsg4"
                          : "") + notif.associate?.image
                      }
                    />
                    <AvatarFallback>
                      {generateInitials(notif.associate.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <a
                  href={`/post/${notif.post.id}`}
                  className={" flex flex-col w-[70%]   justify-center "}
                >
                  <h2 className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {generateNotifContent(notif)}
                  </h2>

                  <p className="text-muted-foreground text-xs">
                    {getTimeAgo(notif.createdAt)}
                  </p>
                </a>

                <form
                  className=" mx-2 my-4  justify-end flex-grow w-[7%] flex  items-center"
                  action={deleteNotification.bind(null, notif.id)}
                >
                  <NotificationDeleteButton />
                </form>
              </Card>
            );
          })
        ) : (
          <>
            <Image
              className=" mx-auto mt-32"
              alt={"no notifications svg"}
              src={notifpic}
              width={200}
              height={200}
            ></Image>
            <h1 className="text-md text-muted-foreground text-center mt-4">
              No notifications!
            </h1>
          </>
        )}
      </ul>
    </main>
  );
};

export default NotificationsPage;
