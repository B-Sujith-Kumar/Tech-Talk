import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { auth, ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";
import Sidebar from "./(root)/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Tech Talk",
    description: "A social media platform for developers to share their thoughts and ideas.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {userId} = auth();
    const currentUser = userId && await getUser(userId);
    const { data, status } = await getCommunitiesJoinedByUser(currentUser);
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="font-sans">
                    <Toaster />
                    <Navbar
                        userId={userId}
                        communities={status !== 200 ? [] : data}
                    />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}