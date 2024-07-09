import { auth } from "@clerk/nextjs";
import Sidebar from "../../(root)/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();
  return (
    <>
      <main className="pt-16 p-4 bg-gray-100 h-screen overflow-y-scroll scrollbar-hidden">
        <div className="flex flex-row gap-4 mt-2 *:min-h-full">
          <Sidebar />
          <div className="w-full">{children}</div>
        </div>
      </main>
    </>
  );
}
