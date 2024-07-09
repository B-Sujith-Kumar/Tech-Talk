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

const CommunityOptions = ({community}: {community: ICommunity}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border rounded-full text-gray-700 border-gray-500 p-2 px-3">
          <FontAwesomeIcon icon={faEllipsis} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 flex flex-col bg-white">
        <DropdownMenuItem className="hover:bg-gray-300 px-3 py-3">Mute c/{community.name}</DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-300 px-3 py-3">Add to favorites</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommunityOptions;
