import DashboardSidebar from "@/components/shared/Dashboard/DashboardSidebar";
import PostChart from "@/components/shared/Dashboard/SampleChart";
import { getStats, getUser } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";
import React from "react";

const Analytics = async () => {
    const { userId } = auth();
    const currentUser = await getUser(userId as string);
    const stats = await getStats(userId as string);
    return (
        <div className="flex">
            <DashboardSidebar stats={stats} />
            <PostChart period="daily" currentUser={currentUser._id as string} />
        </div>
    );
};

export default Analytics;
