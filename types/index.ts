export type createUserType = {
    clerkId: string;
    username?: string | null;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

export type updateUserType = {
    clerkId: string;
    username?: string | null;
    firstName: string;
    lastName: string;
    profilePicture: string;
}