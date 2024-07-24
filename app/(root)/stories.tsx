import CreateStoryComp from "./_components/StoryComp";
import { getFollowingPeoplesStories, getUserStories } from "@/lib/actions/story.actions";
import ViewStoryComp from "./_components/ViewStory";

export const Stories = async () => {
    const userStoriesData = await getUserStories();
    const followingPeopleStoriesData = await getFollowingPeoplesStories();
    return (
        <>
            <div id="stories">
                <div className="flex flex-row items-center gap-x-4 p-2 px-4 *: overflow-x-scroll scrollbar-hidden bg-white rounded-md">
                    <div className="flex flex-col items-center w-16 relative">
                        <CreateStoryComp
                            userStoriesData={userStoriesData.data}
                        />
                        <span className="text-xs mt-1">
                            Your Story
                        </span>
                    </div>
                    <ViewStoryComp
                        userStoriesData={followingPeopleStoriesData.data}
                    />
                </div>
            </div>
        </>
    );
};