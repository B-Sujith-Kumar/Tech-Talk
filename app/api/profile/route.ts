import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { profileSchema } from "@/schemas/profile.schema";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { clerkId, user } = await req.json();

    const existingDetails = await User.findOne({ clerkId });
    if (!existingDetails) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    if (existingDetails.username !== user.username) {
      const existingUser = await User.findOne({ username: user.username });
      if (existingUser) {
        console.log("Username already exists");
        return NextResponse.json({ status: 409, message: 'Username already exists' });
      }

      const params = { firstName: user.firstName, lastName: user.lastName, username: user.username };
      const updatedClerkUser = await clerkClient.users.updateUser(clerkId, params);
      if (!updatedClerkUser) {
        return NextResponse.json({ status: 500, message: 'Clerk user update failed' });
      }
    }
    console.log(user.profilePicture.split(',')[1]);
    if (user.profilePicture !== existingDetails.profilePicture) {
        const base64String = user.profilePicture.split(',')[1];
      if (!base64String) {
        console.log("Invalid profile picture format");
        return NextResponse.json({ status: 400, message: 'Invalid profile picture format' });
      }
      const buffer = Buffer.from(base64String, 'base64');
      const profilePictureBlob = new Blob([buffer], { type: 'image/jpeg' }); // Adjust MIME type as needed
      await clerkClient.users.updateUserProfileImage(clerkId, { file: profilePictureBlob });
    }

    const userUpdateData = {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      githubLink: user.githubLink,
      linkedinLink: user.linkedinLink,
      location: user.location,
      websiteUrl: user.websiteUrl,
      skills: user.skills,
      work: user.work,
      education: user.education,
      currentlyLearning: user.currentlyLearning,
      availableFor: user.availableFor
    };

    const updatedUser = await User.findByIdAndUpdate(
      existingDetails._id,
      { $set: userUpdateData },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User update failed');
    }

    revalidatePath('/profile');
    return NextResponse.json({ status: 200, user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error' });
  }
}