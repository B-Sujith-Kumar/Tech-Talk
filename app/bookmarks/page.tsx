import CreateCollection from "@/components/shared/Bookmarks/CreateCollection";
import { getCollections } from "@/lib/actions/collection.actions";
import { getUserObjectId } from "@/lib/actions/user.actions";
import { ICollection } from "@/lib/database/models/collection.model";
import { ICollectionPopualted } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Bookmarks = async () => {
  const { userId } = auth();
  const currentUser = await getUserObjectId(userId || "");
  const collections = await getCollections(currentUser || "");
  return (
    <div>
      <div>
        <h1 className="lg:text-3xl text-2xl font-semibold">Bookmarks</h1>
        <p className="mt-2 text-gray-600 text-sm">
          See all your bookmarks here organized into collections. You can
          bookmark any post by clicking on the bookmark icon.
        </p>
        <div className="grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2  mt-4 gap-3">
          {collections &&
            collections.map((item: ICollectionPopualted) => (
              <Link
                href={`/collection/${item._id}`}
                className="border rounded-lg border-gray-300 max-sm:pb-2"
              >
                {item?.posts?.length! > 0 && (
                  <Image
                    src={item?.posts[0]?.coverImage! || ""}
                    alt={item.posts[0].title}
                    width={200}
                    height={200}
                    className="w-full rounded-t-lg h-[53%]"
                  />
                )}
                {!(item?.posts?.length! > 0) && (
                  <div className="w-full h-[53%] bg-gray-300 rounded-t-lg">
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500 text-sm">
                        No posts in this collection
                      </p>
                    </div>
                  </div>
                )}
                <div className="px-3 py-2">
                  <h1 className="font-semibold text-xl">{item.name}</h1>
                  <p className="text-sm line-clamp-2 mt-2 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <div className="fixed bottom-6 right-5">
        <CreateCollection currentUser={currentUser || ""} />
      </div>
    </div>
  );
};

export default Bookmarks;
