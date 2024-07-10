"use server";

import { auth } from "@clerk/nextjs";

export async function isAuth() {
    const { userId } = auth();
    return userId !== null ? true : false;
}