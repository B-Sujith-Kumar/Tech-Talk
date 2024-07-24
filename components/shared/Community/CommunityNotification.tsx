"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  turnOffCommunityNotification,
  turnOnCommunityNotification,
} from "@/lib/actions/community.actions";
import { ICommunity } from "@/lib/database/models/community.model";
import { IUser } from "@/lib/database/models/user.model";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CommunityNotification = ({
  notificationState,
  user,
  community,
}: {
  notificationState: boolean;
  user: IUser;
  community: ICommunity;
}) => {
  const [state, setState] = React.useState(notificationState);
  const { toast } = useToast();
  const handleTurnOff = async () => {
    try {
      const { success } = await turnOffCommunityNotification(
        community._id?.toString()!,
        user._id?.toString()!
      );
      if (success) {
        setState(false);
        toast({
          title: "Notification Turned Off",
          description:
            "You will no longer receive notifications from this community",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while turning off notifications",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while turning off notifications",
      });
    }
  };
  const handleTurnOn = async () => {
    try {
      const { success } = await turnOnCommunityNotification(
        community._id?.toString()!,
        user._id?.toString()!
      );
      if (success) {
        setState(true);
        toast({
          title: "Notification Turned On",
          description: "You will now receive notifications from this community",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while turning on notifications",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while turning on notifications",
      });
    }
  };
  return (
    <div>
      {state && (
        <div className="border rounded-full py-2 px-3 cursor-poiner  border-gray-500">
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faBell}
            size="lg"
            onClick={handleTurnOff}
          />
        </div>
      )}
      {!state && (
        <div className="border rounded-full cursor-pointer py-2 px-3  border-gray-500">
          <FontAwesomeIcon
            icon={faBellSlash}
            size="lg"
            className="cursor-pointer"
            onClick={handleTurnOn}
          />
        </div>
      )}
    </div>
  );
};

export default CommunityNotification;
