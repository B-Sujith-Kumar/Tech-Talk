"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const SignInButton = () => {
    const router = useRouter();
    return <>
        <Button variant="outline" className="hover:bg-indigo-500 hover:text-white" onClick={() => router.push("/sign-in")}>
            Sign In
        </Button>
    </>
}