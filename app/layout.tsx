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

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Tech Talk",
    description: "A social media platform for developers to share their thoughts and ideas.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userId } = auth();
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <Toaster />
                    <Navbar userId={userId} />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}