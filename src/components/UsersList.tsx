"use client";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Ban,
  ChevronDown,
  Loader2,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import changeFriendRequest from "@/actions/changeFriendRequest";
import getFriendRequest from "@/actions/getFriendRequest";

interface UserWithRelation extends User {
  relation?: string;
  friendRequestSent?: boolean;
  friendRequestReceived?: boolean;
}

const UsersList = ({
  user,
  onlyBlocked,
  onlyRequests,
  onlyFriends,
}: {
  user: User;
  onlyBlocked?: boolean;
  onlyRequests?: boolean;
  onlyFriends?: boolean;
}) => {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserWithRelation[]>([]);
  const [page, setPage] = useState(0);
  const [pending, setPending] = useState(false);
  const [blockpending, setBlockpending] = useState(false);
  const { ref, inView } = useInView();
  const { toast } = useToast();
  const [noUsers, setNoUsers] = useState(false);

  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (users.length === 0) setNoUsers(true);
    else setNoUsers(false);
  }, [users]);

  useEffect(() => {
    (async () => {
      if (ended) return;

      if (inView) {
        let newUsers: UserWithRelation[] = await getUsersBySearchTerm(
          user.id,
          page * 5,
          onlyBlocked || onlyFriends ? "" : searchParams.get("key") || "",
          onlyBlocked,
          onlyFriends
        );
        if (newUsers.length === 0) setNoUsers(true);

        for (const u of newUsers) {
          u.relation = await getUserRelation(u.id, user.id);
          u.friendRequestSent = !!(await getFriendRequest(user.id, u.id, true));
          u.friendRequestReceived = !!(await getFriendRequest(user.id, u.id));
        }

        if (newUsers.length < 5) setEnded(true);

        setUsers((prev) => [...prev, ...newUsers]);
        setPage((prev) => ++prev);
      }
    })();
  }, [inView, ended, onlyBlocked, onlyFriends, page, searchParams, user.id]);
  return (
    <div className="w-full mx-auto max-w-[40rem] space-y-4">
      {!noUsers ? (
        users.map((person: UserWithRelation, index: number) => {
          if (onlyRequests && !person.friendRequestReceived)
            return (
              <div key={index}>
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
              </div>
            );
          return (
            <Card
              key={index}
              className="flex  w-full items-center  hover:bg-secondary hover:cursor-pointer "
              onClick={() => (window.location.href = `/profile/${person.id}`)}
            >
              <div className="flex sm:w-[13%]  overflow-hidden w-[17%]">
                <Avatar className=" m-2 md:h-14 md:w-14 h-10 w-10 border-2">
                  <AvatarImage
                    src={"https://ik.imagekit.io/vmkz9ivsg4" + person?.image}
                  />
                  <AvatarFallback>
                    {generateInitials(person?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div
                className={
                  "  flex flex-col md:w-[55%] w-[50%] pr-2 overflow-hidden  justify-center "
                }
              >
                <h2
                  className={
                    " text-md font-bold overflow-hidden whitespace-nowrap text-ellipsis"
                  }
                >
                  {splitStringToWords(
                    person.name || "",
                    searchParams.get("key") || ""
                  ).map((w, index) => (
                    <span
                      className={index == 1 ? "bg-primary" : ""}
                      key={index}
                    >
                      {w}
                    </span>
                  ))}
                </h2>
              </div>
              <div className="md:w-[30%]  flex flex-grow pr-1 justify-center md:flex-row items-center flex-col gap-1 py-2   ">
                {onlyBlocked ||
                  (!person.friendRequestReceived ? (
                    <Button
                      size={"sm"}
                      className="border-primary py-0 group transition-all"
                      disabled={pending}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setPending(true);
                        try {
                          if (person.friendRequestSent) {
                            //cancel the request sent by the user himself
                            await changeFriendRequest(user.id, person.id, true);

                            setUsers((prev) =>
                              prev.map((u) =>
                                u.id === person.id
                                  ? {
                                      ...u,
                                      relation: undefined,
                                      friendRequestSent: false,
                                      friendRequestReceived: false,
                                    }
                                  : u
                              )
                            );
                          } else if (!person.relation) {
                            //not friends so send friend request

                            await changeFriendRequest(user.id, person.id);
                            toast({
                              description: `Friend request sent to ${person.name}`,
                            });
                            setUsers((prev) =>
                              prev.map((u) =>
                                u.id === person.id
                                  ? {
                                      ...u,
                                      relation: undefined,
                                      friendRequestSent: true,
                                      friendRequestReceived: false,
                                    }
                                  : u
                              )
                            );
                          } else if (person.relation === RelationType.FRIEND) {
                            //already friends so unfriend
                            await changeUserRelation(user.id, person.id);
                            toast({
                              description: `${person.name} and you are no longer friends`,
                            });

                            onlyFriends
                              ? setUsers((prev) =>
                                  prev.filter((u) => u.id !== person.id)
                                )
                              : setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === person.id
                                      ? {
                                          ...u,
                                          relation: undefined,
                                          friendRequestSent: false,
                                          friendRequestReceived: false,
                                        }
                                      : u
                                  )
                                );
                          }
                        } catch {
                          toast({
                            title: "Error",
                            variant: "destructive",
                            description: `Action failed to complete.`,
                          });
                        }

                        setPending(false);
                      }}
                    >
                      {person.relation === RelationType.FRIEND ? (
                        <>
                          <div className="flex items-center group-hover:hidden text-xs gap-1">
                            {pending ? (
                              <Loader2
                                className="animate-spin mr-2"
                                size={20}
                              />
                            ) : (
                              <UserRoundCheck size={20} />
                            )}
                            Friends
                          </div>
                          <div className=" items-center hidden group-hover:flex text-xs gap-1">
                            {pending ? (
                              <Loader2
                                className="animate-spin mr-2"
                                size={20}
                              />
                            ) : (
                              <UserRoundX size={20} />
                            )}
                            Unfriend
                          </div>
                        </>
                      ) : person.friendRequestSent ? (
                        <div className="flex items-center  text-xs gap-1">
                          {pending ? (
                            <Loader2 className="animate-spin mr-2" size={20} />
                          ) : (
                            "Cancel request"
                          )}
                        </div>
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
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"sm"}
                          className="border-primary py-0 group flex transition-all"
                          disabled={pending}
                        >
                          {pending ? (
                            <Loader2 className="animate-spin mr-2" size={20} />
                          ) : (
                            <>
                              <p className="text-xs">Request received</p>
                              <ChevronDown size={16} />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            setPending(true);
                            try {
                              await changeUserRelation(
                                user.id,
                                person.id,
                                RelationType.FRIEND
                              );
                              //changeUserRelation also deletes the friend request
                              toast({
                                description: `${person.name}'s friend request has been accepted.`,
                              });
                              onlyRequests
                                ? setUsers((prev) =>
                                    prev.filter((u) => u.id !== person.id)
                                  )
                                : setUsers((prev) =>
                                    prev.map((u) =>
                                      u.id === person.id
                                        ? {
                                            ...u,
                                            relation: RelationType.FRIEND,
                                            friendRequestSent: false,
                                            friendRequestReceived: false,
                                          }
                                        : u
                                    )
                                  );
                            } catch {
                              toast({
                                title: "Error",
                                variant: "destructive",
                                description: `Action failed to complete.`,
                              });
                            }
                            setPending(false);
                          }}
                        >
                          Accept
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            setPending(true);
                            try {
                              await changeFriendRequest(
                                user.id,
                                person.id,
                                true
                              );
                              toast({
                                description: `${person.name}'s friend request has been declined.`,
                              });

                              onlyRequests
                                ? setUsers((prev) =>
                                    prev.filter((u) => u.id !== person.id)
                                  )
                                : setUsers((prev) =>
                                    prev.map((u) =>
                                      u.id === person.id
                                        ? {
                                            ...u,
                                            relation: undefined,
                                            friendRequestSent: false,
                                            friendRequestReceived: false,
                                          }
                                        : u
                                    )
                                  );
                            } catch {
                              toast({
                                title: "Error",
                                variant: "destructive",
                                description: `Action failed to complete.`,
                              });
                            }

                            setPending(false);
                          }}
                        >
                          Decline
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"sm"}
                        className="border-primary py-0 group ml-1  transition-all"
                        disabled={blockpending}
                        onClick={async (e) => {
                          e.stopPropagation();
                          setBlockpending(true);
                          try {
                            await changeUserRelation(
                              user.id,
                              person.id,
                              onlyBlocked ? undefined : RelationType.BLOCKED
                            );
                            setUsers((prev) =>
                              prev.filter((u) => u.id !== person.id)
                            );
                            toast({
                              description: `${person.name} has been ${
                                onlyBlocked ? "unblocked" : "blocked"
                              }.`,
                            });
                          } catch {
                            toast({
                              description: `Action failed to complete.`,
                            });
                          }

                          setBlockpending(false);
                        }}
                      >
                        {blockpending ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <Ban
                              size={20}
                              className={onlyBlocked ? "mr-2" : ""}
                            />
                            {onlyBlocked ? "Unblock" : ""}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {onlyBlocked ? <p>Unblock user</p> : <p>Block user</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
