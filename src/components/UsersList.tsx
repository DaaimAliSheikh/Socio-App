"use client";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Ban,
  Loader2,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";

import getUsersBySearchTerm from "@/actions/getUsersBySearchTerm";
import { RelationType, User } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import getUserRelation from "@/actions/getUserRelation";
import splitStringToWords from "@/lib/splitStringToWords";
import { Button } from "./ui/button";

import changeUserRelation from "@/actions/changeUserRelation";
import generateInitials from "@/lib/generateInitials";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import noPeopleSvg from "../../public/no-people.svg";
import Image from "next/image";

interface UserWithRelation extends User {
  relation?: string;
}

const UsersList = ({ user }: { user: User }) => {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserWithRelation[]>([]);
  const [page, setPage] = useState(0);
  const [pending, setPending] = useState(false);
  const [blockpending, setBlockpending] = useState(false);
  const { ref, inView } = useInView();
  const { toast } = useToast();

  const [ended, setEnded] = useState(false);

  const searchArray = splitStringToWords(searchParams.get("key") || "");

  useEffect(() => {
    (async () => {
      if (ended) return;

      if (inView) {
        let newUsers: UserWithRelation[] = await getUsersBySearchTerm(
          user.id,
          page * 5,
          searchParams.get("key") || ""
        );

        for (const u of newUsers) {
          u.relation = await getUserRelation(u.id, user.id);
        }

        if (newUsers.length < 5) setEnded(true);

        setUsers((prev) => [...prev, ...newUsers]);
        setPage((prev) => ++prev);
      }
    })();
  }, [inView]);
  return (
    <div className="w-full mx-auto max-w-[40rem] space-y-4">
      {users.length > 0 ? (
        users.map((person: UserWithRelation, index: number) => {
          return (
            <Card
              key={index}
              className="flex  w-full items-center hover:bg-secondary hover:cursor-pointer "
            >
              <div className="flex sm:w-[13%]  overflow-hidden w-[18%]">
                <Avatar className=" m-2 h-14 w-14 border-2">
                  <AvatarImage
                    src={"https://ik.imagekit.io/vmkz9ivsg4" + user?.image}
                  />
                  <AvatarFallback>
                    {generateInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div
                className={
                  "  flex flex-col sm:w-[60%] w-[50%] pr-1   justify-center "
                }
              >
                <h2
                  className={
                    "justify-center text-md font-bold overflow-hidden whitespace-nowrap text-ellipsis"
                  }
                >
                  {!searchParams.get("key")
                    ? person.name
                    : splitStringToWords(person.name || "").map(
                        (w, index: number) => (
                          <span key={index}>
                            <span
                              className={
                                searchArray.includes(w) ? "bg-primary" : ""
                              }
                            >
                              {w}
                            </span>{" "}
                          </span>
                        )
                      )}
                </h2>

                <p className="text-xs text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                  {person.bio}
                </p>
              </div>
              <div className="sm:w-[30%]  justify-center flex  ">
                <Button
                  size={"sm"}
                  className="border-primary py-0 group transition-all"
                  disabled={pending}
                  onClick={async () => {
                    setPending(true);
                    if (!person.relation) {
                      //not friends so add friend

                      await changeUserRelation(
                        user.id,
                        person.id,
                        RelationType.FRIEND
                      );
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === person.id
                            ? { ...u, relation: RelationType.FRIEND }
                            : u
                        )
                      );
                    }
                    if (person.relation === RelationType.FRIEND) {
                      //already friends so unfriend
                      await changeUserRelation(user.id, person.id);
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === person.id ? { ...u, relation: undefined } : u
                        )
                      );
                    }

                    setPending(false);
                  }}
                >
                  {person.relation === RelationType.FRIEND ? (
                    <>
                      <div className="flex items-center group-hover:hidden text-xs gap-1">
                        {pending ? (
                          <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                          <UserRoundCheck size={20} />
                        )}
                        Friends
                      </div>
                      <div className=" items-center hidden group-hover:flex text-xs gap-1">
                        {pending ? (
                          <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                          <UserRoundX size={20} />
                        )}
                        Unfriend
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center  text-xs gap-1">
                      {pending ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        <UserRoundPlus size={20} />
                      )}
                      Add Friend
                    </div>
                  )}
                </Button>

                <Button
                  size={"sm"}
                  className="border-primary py-0 group ml-1 transition-all"
                  disabled={blockpending}
                  onClick={async () => {
                    setBlockpending(true);
                    await changeUserRelation(
                      user.id,
                      person.id,
                      RelationType.BLOCKED
                    );
                    setUsers((prev) => prev.filter((u) => u.id !== person.id));
                    setBlockpending(false);
                    toast({
                      description: `${person.name} has been blocked.`,
                    });
                  }}
                >
                  {blockpending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Ban size={20} />
                  )}
                </Button>
              </div>
            </Card>
          );
        })
      ) : (
        <>
          <Image
            alt="no people found"
            height={200}
            width={200}
            className="mx-auto mt-10"
            src={noPeopleSvg}
          />
          <p className="text-center text-muted-foreground text-lg">
            No people found
          </p>
        </>
      )}
      <div ref={ref}>
        <Loader2
          ref={ref}
          className={`${ended ? "hidden" : ""} animate-spin mx-auto m-6`}
        />
      </div>
    </div>
  );
};

export default UsersList;
