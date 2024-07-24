import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import CreateStoryComp from "./_components/StoryComp";

export const Stories = async () => {
    const user = await currentUser();
    return (
        <>
            <div id="stories">
                <div className="flex flex-row items-center gap-x-4 p-2 px-4 *: overflow-x-scroll scrollbar-hidden bg-white rounded-md">
                    <div className="flex flex-col items-center w-16 relative">
                        <CreateStoryComp />
                        <span className="text-xs mt-1">
                            Your Story
                        </span>
                    </div>
                    {new Array(20).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col items-center w-16 relative">
                            <Image
                                src="/images/1.jpeg"
                                alt="Image 2"
                                width={400}
                                height={400}
                                className={` min-w-16 h-16 rounded-full border-2 object-cover cursor-pointer p-1
                                ${i % 2 === 0 ? "border-indigo-500" : ""}
                                `}
                            />
                            <span className="text-xs mt-1">
                                User {i}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};