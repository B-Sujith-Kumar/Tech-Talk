"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export const HomePageViewPostOrderBy = () => {
    const router = useRouter();
    const queryParams = useSearchParams();
    const defaultValue = queryParams.get("orderBy") || "latest";
    return <Select onValueChange={(e) => {
        router.push("/?orderBy=" + e);
    }}
    >
        <SelectTrigger className="bg-gray-100 border-gray-100 text-gray-600 text-xs focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
            <SelectValue placeholder="Latest" />
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-600 border-none text-xs" defaultValue={defaultValue} >
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
        </SelectContent>
    </Select >
}