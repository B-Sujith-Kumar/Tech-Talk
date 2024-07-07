import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    
  return (
    <div className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <header className="px-20 py-3 flex items-center justify-between gap-7 max-[1034px]:px-10 max-[828px]:px-6">
        <div className="flex items-center sm:flex-1 gap-44 max-[1034px]:gap-12">
          <Link
            href="/"
            className="font-medium text-xl bg-black text-white px-3 py-2 rounded-xl"
          >
            TechTalk
          </Link>
          <div className="w-[50%]">
            <div className="flex gap-1 max-md:hidden items-center bg-gray-200 px-3 rounded-md w-full">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-gray-500"
              />
              <input
                type="text"
                className="bg-gray-200 border-0 px-3 placeholder:text-gray-500 py-2 rounded-lg outline-none flex-1"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 max-sm:gap-2">
          <div className="hover:cursor-pointer md:hidden px-4 py-2 rounded-xl flex gap-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="" size="lg" />
          </div>
          <SignedIn>
            <div className="hover:cursor-pointer px-4 py-2 rounded-xl flex gap-4">
              <FontAwesomeIcon icon={faBell} className="" size="lg" />
            </div>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-up"
              className="text-lg font-sans hover:cursor-pointer rounded-lg hover:underline hover:text-blue-700 hover:bg-blue-100 px-3 py-2 text-slate-600 max-[795px]:hidden"
            >
              Create account
            </Link>
            <Button asChild className="px-6">
              <Link
                href="/sign-in"
                className="border-blue-600 border text-blue-600 hover:text-white hover:bg-blue-600 text-lg px-4"
              >
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
