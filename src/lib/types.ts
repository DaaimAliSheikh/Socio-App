import { NotificationType } from "@prisma/client";

export type NotificationItem = {
  post: {
    id: string;
  };
  createdAt: Date;
  id: string;
  associateId: string;
  type: NotificationType;
  associate: {
    name: string | null;
    image: string | null;
  };
};

export type StoryItem = {
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
} & {
  id: string;
  createdAt: Date;
  userId: string;
  imagePath: string;
  expires: Date;
};

export type PostItem = {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  comments: {
    id: string;
    likes: number;
    content: string;
    createdAt: Date;
    edited: boolean;
    authorId: string;
    postId: string;
  }[];
} & {
  id: string;
  createdAt: Date;
  edited: boolean;
  authorId: string;
  title: string;
  description: string;
  imagePaths: string[];
  likes: number;
};
