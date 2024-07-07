import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
