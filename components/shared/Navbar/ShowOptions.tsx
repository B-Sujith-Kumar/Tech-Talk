"use client"
import { IUser } from "@/lib/database/models/user.model";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

const ShowOptions = ({ user }: { user: IUser }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <p className="text-sm font-medium">
            {user.firstName + " " + user.lastName}
          </p>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] mt-2 right-8 px-2 py-2 relative">
          <Link
            href={"/dashboard/posts"}
            className="w-full hover:text-indigo-700 underline-offset-2 hover:underline py-1 px-2"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ShowOptions;
