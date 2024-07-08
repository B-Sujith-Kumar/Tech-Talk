// <<<<<<< HEAD
"use client";

import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Bell, Bookmark, Menu } from "lucide-react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/app/(root)/Sidebar";
import { useRouter } from "next/navigation";
import CreateCommunity from "../Community/CreateCommunity";

const Navbar = () => {
    const router = useRouter();
    return (
        <>
            <nav className="h-[3.35rem] fixed top-0 w-full flex items-center justify-between z-50 bg-white px-4">
                <div className="flex items-center md:flex-1 gap-44 max-[1034px]:gap-12">
                    <Link href="/" className="flex items-center justify-center gap-2">
                        <Image
                            className="h-8 w-auto rounded-full max-md:w-8 max-md:h-auto"
                            src="/logo.jpeg"
                            alt="Tech Talk"
                            height={32}
                            width={32}
                            priority={false}
                        />
                        <span className="text-lg font-medium leading-6 hover:text-gray-600 max-md:hidden">
                            Tech Talk
                        </span>
                    </Link>
                    <div className="w-1/2 max-md:hidden">
                        <div className="flex gap-1 items-center bg-gray-100 px-3 rounded-2xl w-full border border-gray-200">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="text-gray-500"
                            />
                            <input
                                type="text"
                                className="bg-gray-100 border-0 px-3 placeholder:text-gray-400 py-1 outline-none flex-1"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <SignedIn>
                        <div className="bg-gray-100 rounded-md p-2 cursor-pointer">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild title="Notifications">
                                    <Bell size={18} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-white">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="flex flex-col gap-2 p-2 *:cursor-pointer *:border-b ">
                                        <DropdownMenuCheckboxItem>
                                            Notification 1
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Notification 2
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Notification 3
                                        </DropdownMenuCheckboxItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="bg-gray-100 rounded-md p-2 cursor-pointer">
                            <Bookmark size={18} />
                        </div>
                        <CreateCommunity />
                        <div className="sm:hidden">
                        <UserButton
                            afterSignOutUrl="/"
                            />  
                            </div>
                            <div className="max-sm:hidden">
                        <UserButton
                            afterSignOutUrl="/"
                            showName={true}
                            />
                            </div>
                    </SignedIn>
                    <SignedOut>
                        <Button variant="outline" className="hover:bg-indigo-500 hover:text-white" onClick={() => router.push("/sign-in")}>
                            Sign In
                        </Button>
                    </SignedOut>
                    <Sheet>
                        <SheetTrigger>
                            <Menu size={18} className="lg:hidden" />
                        </SheetTrigger>
                        <SheetContent className="flex flex-row sm:flex-col p-4 bg-white w-fit sm:h-screen z-50 pt-6">
                            <Sidebar isMobile={true} />
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
// =======
// import Link from "next/link";
// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import CreateCommunity from "../Community/CreateCommunity";

// const Navbar = () => {
    
//   return (
//     <div className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
//       <header className="px-20 py-3 flex items-center justify-between gap-7 max-[1034px]:px-10 max-[828px]:px-6">
//         <div className="flex items-center sm:flex-1 gap-44 max-[1034px]:gap-12">
//           <Link
//             href="/"
//             className="font-medium text-xl bg-black text-white px-3 py-2 rounded-xl"
//           >
//             TechTalk
//           </Link>
//           <div className="w-[50%]">
//             <div className="flex gap-1 max-md:hidden items-center bg-gray-200 px-3 rounded-md w-full">
//               <FontAwesomeIcon
//                 icon={faMagnifyingGlass}
//                 className="text-gray-500"
//               />
//               <input
//                 type="text"
//                 className="bg-gray-200 border-0 px-3 placeholder:text-gray-500 py-2 rounded-lg outline-none flex-1"
//                 placeholder="Search"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 max-sm:gap-2">
//           <div className="hover:cursor-pointer md:hidden px-4 py-2 rounded-xl flex gap-4">
//             <FontAwesomeIcon icon={faMagnifyingGlass} className="" size="lg" />
//           </div>
//           <SignedIn>
//             <div className="hover:cursor-pointer px-4 py-2 rounded-xl flex gap-4">
//               <FontAwesomeIcon icon={faBell} className="" size="lg" />
//             </div>
//             <CreateCommunity />
//             <UserButton afterSignOutUrl="/" />
//           </SignedIn>
//           <SignedOut>
//             <Link
//               href="/sign-up"
//               className="text-lg font-sans hover:cursor-pointer rounded-lg hover:underline hover:text-blue-700 hover:bg-blue-100 px-3 py-2 text-slate-600 max-[795px]:hidden"
//             >
//               Create account
//             </Link>
//             <Button asChild className="px-6">
//               <Link
//                 href="/sign-in"
//                 className="border-blue-600 border text-blue-600 hover:text-white hover:bg-blue-600 text-lg px-4"
//               >
//                 Login
//               </Link>
//             </Button>
//           </SignedOut>
//         </div>
//       </header>
//     </div>
//   );
// };

// export default Navbar;
// >>>>>>> 168b5aa62b52e99e56206be3b8df4038a7013ad9
