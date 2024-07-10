import { auth } from "@/auth";
import getUserById from "@/lib/getUserById";
import Stories from "@/components/Stories";
import NewPost from "@/components/NewPost";
import PostList from "@/components/PostList";

const HomePage = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);

  return (
    <div className="flex-grow flex flex-col items-center max-w-[50rem] mx-auto w-[90%]  mt-2">
      <NewPost />
      <Stories />
      <PostList />
    </div>
  );
};

export default HomePage;
