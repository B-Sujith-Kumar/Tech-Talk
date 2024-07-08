"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export const Stories = () => {
    const { user } = useUser();
    return (
        <>
            <div id="stories">
                <div className="flex flex-row items-center gap-x-4 p-2 *: overflow-x-scroll scrollbar-hidden bg-white rounded-md">
                    <div className="flex flex-col items-center w-16 relative">
                        <Image
                            src={user?.imageUrl as string || "/images/1.jpeg"}
                            alt={user?.fullName as string || "User"}
                            width={400}
                            height={400}
                            className="min-w-16 h-auto rounded-full border-2 object-cover cursor-pointer"
                        />
                        <p className="absolute bottom-4 left-10 bg-indigo-600 text-white rounded-full cursor-pointer mx-auto text-center w-6 h-6 border-2 border-gray-200">
                            +
                        </p>
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
                                className={` min-w-16 h-auto rounded-full border-2 object-cover cursor-pointer p-1
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