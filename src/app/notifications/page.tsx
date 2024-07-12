import { Card } from "@/components/ui/card";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [{ person: "dad", type: "like", date: "today" }];

const NotificationsPage = ({ params }: { params: { userId: string } }) => {
  ///retrieve the notifications from the database server action

  return (
    <main className="flex items-start flex-col  w-[90%] mx-auto  max-w-[40rem]">
      <h1 className="text-1xl text-muted-foreground font-bold my-2">
        Notifications
      </h1>
      <ul className="w-full">
        {notifications.map((notif, index) => {
          return (
            <Card
              key={index}
              className="flex justify-between w-full items-center hover:bg-secondary hover:cursor-pointer "
            >
              <div className="flex  overflow-hidden">
                <Avatar className=" m-4 h-10 w-10 border-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div
                  className={
                    " ml-2 flex flex-col w-[70%] md:w-[80%]  justify-center "
                  }
                >
                  <h2
                    className={
                      "justify-center text-md font-bold overflow-hidden  text-ellipsis"
                    }
                  >
                    {notif.type}
                  </h2>

                  <p className="text-xs text-muted-foreground overflow-hidden  text-ellipsis">
                    {notif?.date}
                  </p>
                </div>
              </div>
              <Button size={"icon"} className="mr-4">
                <Trash2 />
              </Button>
            </Card>
          );
        })}
      </ul>
    </main>
  );
};

export default NotificationsPage;
