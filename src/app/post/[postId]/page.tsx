import noPostsSvg from "../../../../public/no-posts.svg";
import Image from "next/image";
import getPostByPostId from "@/actions/getPostByPostId";
import getUserById from "@/lib/getUserById";
import { auth } from "@/auth";
import PostList from "@/components/PostList";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const PostPage = async ({
  params: { postId },
}: {
  params: { postId: string };
}) => {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  if (!user) return;
  const post = await getPostByPostId(postId);

  if (!post)
    return (
      <div className="w-1/3 md:w-1/5 md:mt-24 m-20 mx-auto">
        <Image alt="no post found" src={noPostsSvg} sizes="100vw" />
        <p className="text-muted-foreground text-center text-lg m-4">
          No post found
        </p>
      </div>
    );
  return (
    <div className="w-full max-w-[40rem] px-4 mx-auto mt-3 space-y-4">
      <PostList user={user} initialPosts={[post]}></PostList>
    </div>
  );
};

export default PostPage;
