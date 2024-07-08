"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  faCircleXmark,
  faHashtag,
  faImage,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { BuildingIcon } from "lucide-react";
import { createCommunity } from "@/lib/actions/community.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type community = {
  name?: string;
  description?: string;
};

const CreateCommunity = ({ userId }: { userId: string | null }) => {
  console.log(userId);
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(1);
  const [banner, setBanner] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [communityName, setCommunityName] = useState<string>("");
  const [communityDescription, setCommunityDescription] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [errors, setErrors] = useState<community>({});
  const dots = [1, 2, 3];

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput)) return;
    setTags((prev) => [...prev, tagInput.toLowerCase().replaceAll(" ", "")]);
    setTagInput("");
  };

  const handleNameAndDescription = () => {
    if (!communityName.trim() || !communityDescription.trim()) return;
    if (communityName.length > 50 || communityDescription.length > 256) return;
    if (communityName.length < 3) {
      setErrors({
        name: "Name should be atleast 3 characters",
      });
      return;
    }
    if (communityDescription.length < 10) {
      setErrors({
        description: "Description should be atleast 10 characters",
      });
      return;
    }
    setErrors({});
    setSlide((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const formData: any = {
      name: communityName,
      description: communityDescription,
      banner,
      icon,
      tags,
      createdBy: userId,
    };
    try {
      const res = await createCommunity(formData);
      if (res?.success) {
        setOpen(false);
        router.push("/community");
        toast({
          title: "Community created",
          description: "Congratulations! Your community has been created successfully.",
        });
        console.log("Community created");
      } else {
        console.log("Failed to create community");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-gray-100 rounded-md p-2 cursor-pointer">
        <BuildingIcon size={18} />
      </DialogTrigger>
      <div className="max-md:px-4">
        <DialogContent className="max-w-3xl max-md:max-w-2xl max-sm:max-w-[90%] max-md:rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {slide === 1 && (
                <h1 className="text-2xl">Tell us about your community</h1>
              )}
              {slide === 2 && (
                <h1 className="text-2xl">Style your community</h1>
              )}
              {slide === 3 && <h1 className="text-2xl">Add Tags</h1>}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {slide === 1 && (
                <p>
                  A name and description help people understand what your
                  community is all about
                </p>
              )}
              {slide === 2 && (
                <p>
                  Adding visual flair will catch new members attention and help
                  establish your community&apos;s culture! You can update this
                  at any time.
                </p>
              )}
              {slide === 3 && (
                <p>
                  Add atleast one tag to help interested tech talkers find your
                  community.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            {slide === 1 && (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  className="rounded-2xl px-3 py-4 focus:outline-none w-4/5 bg-gray-300 placeholder:text-sm placeholder:text-gray-600 max-sm:w-full"
                  placeholder="Community name*"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
                <Textarea
                  className="rounded-2xl px-3 py-4 focus-visible:ring-0 focus:outline-none w-4/5 bg-gray-300 placeholder:text-sm placeholder:text-gray-600 max-sm:w-full"
                  placeholder="Community description*"
                  rows={10}
                  maxLength={256}
                  value={communityDescription}
                  onChange={(e) => setCommunityDescription(e.target.value)}
                />
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description}</p>
                )}
              </div>
            )}
            {slide === 2 && (
              <div>
                <div
                  className={`flex justify-between w-[70%] max-sm:w-[100%] hover:bg-gray-300 px-3 py-2 hover:cursor-pointer items-center gap-4 cursor-pointer text-sm`}
                >
                  <p>Banner</p>
                  <span className="rounded-full bg-gray-300 text-sm gap-2 px-3 flex items-center">
                    <FontAwesomeIcon icon={faImage} />
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setBanner(res[0].url);
                      }}
                      appearance={{
                        button: "rounded-full py-0 mt-1 bg-gray-300 text-black",
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (ready && !isUploading)
                            return (
                              <div className="">
                                {banner ? "Change" : "Add"}
                              </div>
                            );
                          if (isUploading) return <div>Uploading</div>;
                        },
                        allowedContent({ ready, fileTypes, isUploading }) {
                          if (!ready) return "";
                          if (ready) return "";
                          if (isUploading) return "";
                        },
                      }}
                    />
                  </span>
                  {/* {banner && <Image src={banner} alt="Banner" height={4} width={20} className="h-10 object-cover w-44 rounded-lg"/>} */}
                </div>
                <div
                  className={`flex justify-between w-[70%] max-sm:w-[100%] hover:bg-gray-300 px-3 py-2 hover:cursor-pointer items-center cursor-pointer text-sm mt-3`}
                >
                  <p>Icon</p>
                  <span className="rounded-full bg-gray-300 text-sm gap-2 px-3 py-0 flex items-center">
                    <FontAwesomeIcon icon={faImage} />{" "}
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setIcon(res[0].url);
                      }}
                      appearance={{
                        button: "rounded-full py-0 mt-1 bg-gray-300 text-black",
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (ready && !isUploading)
                            return (
                              <div className="">{icon ? "Change" : "Add"}</div>
                            );
                          if (isUploading) return <div>Uploading</div>;
                        },
                        allowedContent({ ready, fileTypes, isUploading }) {
                          return "";
                        },
                      }}
                    />
                  </span>
                  {/* {icon && <Image src={icon} alt="Banner" height={4} width={20} className="h-10"/>} */}
                </div>
              </div>
            )}
            {slide === 3 && (
              <div>
                <div className="flex items-center rounded-full px-3 py-2 bg-gray-300 gap-4">
                  <FontAwesomeIcon icon={faHashtag} className="text-gray-700" />
                  <input
                    type="text"
                    className="rounded-2xl focus:outline-none w-full px-3 bg-gray-300  placeholder:text-sm placeholder:text-gray-600"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-full"
                    onClick={addTag}
                  >
                    Add
                  </button>
                </div>
                <div>
                  {tags.length > 0 && (
                    <div className="flex gap-4 mt-4 flex-wrap">
                      {tags.map((tag, id) => (
                        <div
                          className="border-[1.1px] border-slate-600 px-3 py-2 rounded-sm text-sm flex gap-2 items-center"
                          key={id}
                        >
                          <p className="font-medium">#{tag}</p>
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            onClick={() => {
                              setTags((prev) => prev.filter((t) => t !== tag));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6">
                    <h1 className="text-center">Popular Tags</h1>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex justify-center mb-4">
              {dots.map((dot) => (
                <div
                  key={dot}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    dot === slide ? "bg-indigo-700" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <div className="flex gap-4">
                {(slide === 2 || slide === 3) && (
                  <Button
                    className="bg-gray-300 text-black rounded-full"
                    onClick={() => setSlide((prev) => prev - 1)}
                  >
                    Back
                  </Button>
                )}
                {slide === 1 && (
                  <Button
                    className="bg-blue-700 text-white rounded-full"
                    onClick={handleNameAndDescription}
                    disabled={
                      !communityName.trim() || !communityDescription.trim()
                    }
                  >
                    Next
                  </Button>
                )}
                {slide === 2 && (
                  <Button
                    className="bg-blue-700 text-white rounded-full"
                    onClick={() => setSlide((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                )}
                {slide === 3 && (
                  <Button
                    className="bg-blue-700 text-white rounded-full"
                    onClick={handleSubmit}
                    disabled={!tags.length}
                  >
                    Create
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default CreateCommunity;
