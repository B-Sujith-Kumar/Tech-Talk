"use client"
import { useToast } from "@/components/ui/use-toast";
import { acceptInvite, ignoreInvite } from "@/lib/actions/community.actions";
import { ICommunity } from "@/lib/database/models/community.model";
import { IUser } from "@/lib/database/models/user.model";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ModInvite = ({ invite, currentUser } : {invite: ICommunity, currentUser : IUser}) => {
    const {toast} = useToast();
    const handleAccept = async () => {
        try {
            const {success} = await acceptInvite( invite._id?.toString()!, currentUser.clerkId);
            if (success) {
                toast({
                    title: "Invite accepted",
                    description: `You are now a moderator of ${invite.name}`,
                })
            } else {
                toast({
                    title: "Error",
                    description: "An error occurred while accepting the invite",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while accepting the invite",
            })
        }
    }
    const handleIgnore = async () => {
        try {
            const {success} = await ignoreInvite( invite._id?.toString()!, currentUser.clerkId);
            if (success) {
                toast({
                    title: "Invite ignored",
                    description: `You have ignored the invite from ${invite.name}`,
                })
            } else {
                toast({
                    title: "Error",
                    description: "An error occurred while ignoring the invite",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while ignoring the invite",
            })
        }
    }
  return (
    <div
      className="flex border items-center gap-3 px-2 py-2 bg-white rounded-lg"
      key={invite._id?.toString()}
    >
      <Link href={`/community/${invite._id?.toString()}`} className="flex gap-2">
        <Image
          src={invite.icon!}
          width={65}
          height={16}
          alt={invite.name}
          className="rounded-full p-2 aspect-square"
        />
        <div className="">
          <p className="font-medium text-xl">{invite.name}</p>
          <p className="text-sm mt-1 text-gray-600 line-clamp-2">
            {invite.description}
          </p>
        </div>
      </Link>
      <div className="flex gap-2">
        <button className="text-white border text-sm font-semibold border-indigo-500 bg-indigo-500 px-3 py-2 rounded-lg h-fit" onClick={handleAccept}>
          Accept
        </button>
        <button className="text-black border text-sm font-semibold border-indigo-500  px-3 py-2 rounded-lg h-fit" onClick={handleIgnore}>
          Ignore
        </button>
      </div>
    </div>
  );
};

export default ModInvite;
