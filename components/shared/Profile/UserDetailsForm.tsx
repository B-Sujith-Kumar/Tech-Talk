"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IUser } from "@/lib/database/models/user.model";
import { useForm } from "react-hook-form";
import { profileSchema } from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { updateUserDetails } from "@/lib/actions/user.actions";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const UserDetailsForm = ({ user }: { user: IUser }) => {
  const initialValues = { ...user };
  const { toast } = useToast();
  const [profilePicture, setProfilePicture] = useState<Blob | File | string>();
  const form: any = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      convertFileToBase64(file).then((base64String) => {
        setProfilePicture(base64String);
      });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({
          user: {
            ...values,
            profilePicture:
              profilePicture !== undefined
                ? profilePicture
                : initialValues.profilePicture,
          },
          clerkId: user.clerkId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { status } = await res.json();
      if (status === 200) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully. Reload the page to see the changes.",
        });
      } else if (status === 409) {
        toast({
          title: "Conflict",
          description: "The username you entered is already taken.",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while updating your profile.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="max-w-3xl mx-auto py-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="bg-white max-w-3xl px-8 py-4 border shadow-md border-b-0 rounded-lg">
          <p className="text-black text-2xl font-semibold">User</p>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="username" className="text-base">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="username"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.username?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="email" className="text-base">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    disabled
                    aria-disabled="false"
                    className="bg-white cursor-not-allowed focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="mt-6 w-full">
                  <FormLabel htmlFor="firstName" className="text-base">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="firstName"
                      className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.firstName?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="mt-6 w-full">
                  <FormLabel htmlFor="lastName" className="text-base">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="lastName"
                      className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.lastName?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem className="mt-6 w-full">
                <FormLabel htmlFor="profilePicture" className="text-base">
                  Profile image
                </FormLabel>
                <FormControl>
                  <div className="flex gap-3 items-center">
                    <Image
                      src={initialValues.profilePicture!}
                      width={50}
                      height={50}
                      alt={user.username}
                      className="aspect-square rounded-full border border-black"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      id="profilePicture"
                      className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2 px-4 py-2 flex-1"
                      onChange={handleImageChange}
                    />
                  </div>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.profilePicture?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="bg-white max-w-3xl mt-7 px-8 py-4 border shadow-md border-b-0 rounded-lg">
          <p className="text-black text-2xl font-semibold">Basic</p>
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="websiteUrl" className="text-base">
                  Website URL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="websiteUrl"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.websiteUrl?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="location" className="text-base">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="location"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.location?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="mt-6 w-full">
                <FormLabel htmlFor="bio" className="text-base">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id="bio"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.bio?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="bg-white max-w-3xl mt-7 px-8 py-4 border shadow-md border-b-0 rounded-lg">
          <p className="text-black text-2xl font-semibold">Coding</p>
          <FormField
            control={form.control}
            name="currentlyLearning"
            render={({ field }) => (
              <FormItem className="mt-6">
                <label htmlFor="currentlyLearning" className="text-base">
                  Currently learning
                </label>
                <p className="text-sm text-gray-500 my-0">
                  What are you learning right now? What are the new tools and
                  languages you're picking up right now?
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    id="currentlyLearning"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.currentlyLearning?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableFor"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="availableFor" className="text-base">
                  Available for
                </FormLabel>
                <p className="text-sm text-gray-500 my-0">
                  What kinds of collaborations or discussions are you available
                  for? What's a good reason to say Hey! to you these days?
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    id="availableFor"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.availableFor?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem className="mt-6 w-full">
                <FormLabel htmlFor="skills" className="text-base">
                  Skills
                </FormLabel>
                <p className="text-sm text-gray-500 my-0">
                  What tools and languages are you most experienced with? Are
                  you specialized or more of a generalist?
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    id="skills"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.skills?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="bg-white max-w-3xl mt-7 px-8 py-4 border shadow-md border-b-0 rounded-lg">
          <p className="text-black text-2xl font-semibold">Work</p>
          <FormField
            control={form.control}
            name="work"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="work" className="text-base">
                  Work
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="work"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.work?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="education" className="text-base">
                  Education
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="education"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.education?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="bg-white max-w-3xl mt-7 px-8 py-4 border shadow-md border-b-0 rounded-lg">
          <p className="text-black text-2xl font-semibold">Social Profiles</p>
          <FormField
            control={form.control}
            name="linkedinLink"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="linkedinLink" className="text-base">
                  LinkedIn
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="linkedinLink"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.linkedinLink?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubLink"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel htmlFor="githubLink" className="text-base">
                  GitHub
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="githubLink"
                    className="bg-white focus-visible:ring-0 outline-0 focus-visible:ring-offset-0 focus:border-indigo-500 border-2"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.githubLink?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="bg-white max-w-3xl mt-7 px-8 py-6 border shadow-md rounded-lg">
          <Button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white w-full font-bold py-2 px-4 rounded"
          >
            {form.formState.isSubmitting
              ? "Saving..."
              : `Save Profile Information`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserDetailsForm;
