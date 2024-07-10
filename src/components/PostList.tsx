import React from "react";
import Post from "./Post";

const posts = [{ user: "dad", caption: "like", date: "today", img: "adadw" }];

const PostList = () => {
  return (
    <div className="w-full max-w-[40rem] space-y-4">
      {posts.map((post) => {
        return (
          <>
            <Post />
            <Post />
          </>
        );
      })}
    </div>
  );
};

export default PostList;
