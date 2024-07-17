-- CreateTable
CREATE TABLE "CommentLikes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PostLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentLikes_commentId_userId_key" ON "CommentLikes"("commentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLikes_postId_userId_key" ON "PostLikes"("postId", "userId");

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
