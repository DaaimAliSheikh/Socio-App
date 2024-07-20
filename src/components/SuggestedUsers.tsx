import React from "react";
import { User } from "@prisma/client";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import generateInitials from "@/lib/generateInitials";

const SuggestedUsers = ({ users }: { users: User[] }) => {
  return (
    <div className="w-[90%] h-[20vh] my-1 max-w-[50rem] mx-auto">
      <h2 className="text-md text-muted-foreground">SuggestedUsers</h2>

      <div className="grid mt-2 gap-1 grid-rows-1 grid-cols-5">
        {users.map((user) => (
          <Card key={user.id} className="p-1">
            <a href={`/profile/${user.id}`}>
              <Avatar className="mx-auto h-14 w-14">
                <AvatarImage
                  src={
                    (user?.image?.startsWith("/socio")
                      ? "https://ik.imagekit.io/vmkz9ivsg4"
                      : "") + user?.image
                  }
                />
                <AvatarFallback>{generateInitials(user.name)}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-center p-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {user.name}
              </p>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
