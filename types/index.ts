export type createUserType = {
  clerkId: string;
  username?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type updateUserType = {
  clerkId: string;
  username?: string | null;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type createCommunityType = {
  name: string;
  description: string;
  createdBy: string;
  tags: string[];
  icon?: string;
  banner?: string;
};

export type SearchParamProps = {
  params: { id: string; name?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
