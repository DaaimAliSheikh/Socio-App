"use client";

import { RelationType, User } from "@prisma/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import changeFriendRequest from "@/actions/changeFriendRequest";
import changeUserRelation from "@/actions/changeUserRelation";
import {
  Ban,
  ChevronDown,
  Loader2,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface UserWithRelation extends User {
  relation?: string;
  friendRequestSent?: boolean;
  friendRequestReceived?: boolean;
}

const ProfileRelationButtons = ({
  modifiedUser,
  currentUser,
}: {
  modifiedUser: UserWithRelation;
  currentUser: User;
}) => {
  const [pending, setPending] = useState(false);
  const [blockpending, setBlockpending] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<UserWithRelation>(modifiedUser);
  const router = useRouter();

  useEffect(() => {
    setUser(modifiedUser);
  }, [modifiedUser]);

  return (
    <div className="md:w-[30%] mb-2 mx-auto flex flex-grow pr-1 justify-center items-center  gap-1 py-2   ">
      {!user.friendRequestReceived ? (
        <Button
          size={"sm"}
          className="border-primary py-0 group transition-all"
          disabled={pending}
          onClick={async (e) => {
            e.stopPropagation();
            setPending(true);
            try {
              if (user.friendRequestSent) {
                //cancel the request sent by the currentUser himself
                await changeFriendRequest(currentUser.id, user.id, true);
                setUser((u) => ({
                  ...u,
                  relation: undefined,
                  friendRequestSent: false,
                  friendRequestReceived: false,
                }));
              } else if (!user.relation) {
                //not friends so send friend request

                await changeFriendRequest(currentUser.id, user.id);
                toast({
                  description: `Friend request sent to ${user.name}`,
                });
                setUser((u) => ({
                  ...u,

                  relation: undefined,
                  friendRequestSent: true,
                  friendRequestReceived: false,
                }));
              } else if (user.relation === RelationType.FRIEND) {
                //already friends so unfriend
                await changeUserRelation(currentUser.id, user.id);
                toast({
                  description: `${user.name} and you are no longer friends`,
                });
                setUser((u) => ({
                  ...u,
                  relation: undefined,
                  friendRequestSent: false,
                  friendRequestReceived: false,
                }));
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
          {user.relation === RelationType.FRIEND ? (
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
          ) : user.friendRequestSent ? (
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
                    currentUser.id,
                    user.id,
                    RelationType.FRIEND
                  );
                  //changecurrentUserRelation also deletes the friend request

                  toast({
                    description: `${user.name}'s friend request has been accepted.`,
                  });
                  setUser((u) => ({
                    ...u,
                    relation: RelationType.FRIEND,
                    friendRequestSent: false,
                    friendRequestReceived: false,
                  }));
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
                  await changeFriendRequest(currentUser.id, user.id, true);
                  toast({
                    description: `${user.name}'s friend request has been declined.`,
                  });
                  setUser((u) => ({
                    ...u,
                    relation: undefined,
                    friendRequestSent: false,
                    friendRequestReceived: false,
                  }));
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
      )}
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
                    currentUser.id,
                    user.id,
                    RelationType.BLOCKED
                  );
                  window.location.href = "/";
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
                  <Ban size={20} />
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Block user</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProfileRelationButtons;
