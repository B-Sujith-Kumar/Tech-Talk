"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { IUser } from "@/lib/database/models/user.model";
import { IPostPopulated } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { subscribeComments } from "@/lib/actions/user.actions";

const SubscribeComments = ({
  subscribed,
  currentUser,
  post,
}: {
  subscribed: boolean;
  currentUser: IUser;
  post: IPostPopulated;
}) => {
  const [state, setState] = React.useState(subscribed);
  const { toast } = useToast();
  
  const handleChange = async () => {
    try {
      const newState = !state;
      const { status } = await subscribeComments(
        post._id!.toString(),
        currentUser._id!.toString(),
        newState
      );
      if (status === 200) {
        setState(newState);
        if (newState)
          toast({
            title: "Subscribed",
            description:
              "You will now receive notifications for comments on this post",
          });
        else
          toast({
            title: "Unsubscribed",
            description:
              "You will no longer receive notifications for comments on this post",
          });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while subscribing to comments",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while subscribing to comments",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 max-sm:justify-end">
      <p className="font-semibold">Subscribe to comments</p>
      <Switch checked={state} onCheckedChange={handleChange} />
    </div>
  );
};

export default SubscribeComments;
