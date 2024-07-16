import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Bell, Bookmark, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/app/(root)/Sidebar";
import CreateCommunity from "../Community/CreateCommunity";
import { SignInButton } from "./ClientComponents";
import { getUser } from "@/lib/actions/user.actions";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import ShowOptions from "./ShowOptions";
  

const Navbar = async ({
  userId,
  communities,
}: {
  userId: string | null;
  communities: any[];
}) => {
    const user = await getUser(userId);
  return (
    <>
      <nav className="h-[3.35rem] fixed top-0 w-full flex items-center justify-between z-50 bg-white px-4 py-7">
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
                className="bg-gray-100 border-0 px-3 placeholder:text-gray-400 py-[7px] outline-none flex-1"
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
              <Link href="/bookmarks">
                <Bookmark size={18} />
              </Link>
            </div>
            <CreateCommunity userId={userId} />
            <div className="sm:hidden">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="max-sm:hidden flex items-center gap-2">
              <ShowOptions user={user} />
              <UserButton afterSignOutUrl="/" showName={false} />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <Sheet>
            <SheetTrigger>
              <Menu size={18} className="lg:hidden" />
            </SheetTrigger>
            <SheetContent className="flex flex-row sm:flex-col p-4 bg-white w-fit sm:h-screen z-50 pt-6">
              <Sidebar isMobile={true} communitites={communities} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
