import { Loader2Icon } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <Loader2Icon className="animate-spin" />
        </div>
    );
}