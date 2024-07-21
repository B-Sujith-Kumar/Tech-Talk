import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { ICommunity } from "@/lib/database/models/community.model";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { ICommunityPopulated } from "@/types";

const CommunityOptions = async ({ community }: { community: ICommunityPopulated }) => {
  const { userId } = auth();
  const currentUser = await getUser(userId!);
  const isMod =
    community.moderators.some(
      (mod) => mod.toString() === currentUser._id.toString()
    ) || community.createdBy._id?.toString() === currentUser._id.toString();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border rounded-full text-gray-700 border-gray-500 p-2 px-3">
          <FontAwesomeIcon icon={faEllipsis} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 flex flex-col bg-white">
        <DropdownMenuItem className="hover:bg-gray-300 px-3 py-3">
          Mute c/{community.name}
        </DropdownMenuItem>
        {isMod && (
          <DropdownMenuItem className="hover:bg-gray-300 px-3 py-3">
            <Link href={`/community/${community._id?.toString()}/mod-tools`}>
              Mod Tools
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="hover:bg-gray-300 px-3 py-3">
          Add to favorites
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommunityOptions;
