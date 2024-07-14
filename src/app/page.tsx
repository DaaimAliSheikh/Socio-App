import { auth } from "@/auth";
import getUserById from "@/lib/getUserById";
import Stories from "@/components/Stories";
import NewPost from "@/components/NewPost";
import PostList from "@/components/PostList";
import getStories from "@/actions/getStories";
import getPosts from "@/actions/getPosts";

import noPostsSvg from "../../public/no-posts.svg";
import Image from "next/image";

const HomePage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  if (!user) return null;
  const stories = await getStories(user.id);
  const posts = await getPosts(user.id);
  return (
    <div className="flex-grow flex flex-col items-center max-w-[50rem] mx-auto w-[90%]  mt-2">
      <NewPost user={user} />
      <Stories stories={stories} user={user} />
      {posts.length < 1 ? (
        <>
          <Image
            className="w-1/3 md:w-1/4 mt-2"
            alt="no posts"
            src={noPostsSvg}
            sizes="100vw"
          ></Image>
          <h3 className="text-1xl text-foreground mt-4">No posts to show!</h3>
        </>
      ) : (
        <PostList user={user} posts={posts} />
      )}
    </div>
  );
};

export default HomePage;
