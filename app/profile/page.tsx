import UserDetailsForm from "@/components/shared/Profile/UserDetailsForm";
import { getUser } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

const Profile = async () => {
  const { userId } = auth();
  const user = await getUser(userId);
  if (!user) {
    return <div>You are not authorized to view this page.</div>;
  }
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/user/${user.username}`}
          className=" text-3xl  font-semibold text-blue-700"
        >
          @{user.username}
        </Link>
      </div>
      <UserDetailsForm user={user} />;
    </div>
  );
};

export default Profile;
