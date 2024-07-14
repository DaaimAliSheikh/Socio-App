import { NotificationItem } from "./types";

const generateNotifContent = (notif: NotificationItem): string => {
  switch (notif.type) {
    case "LIKED_POST":
      return `${notif.associate.name} liked your post.`;
    case "LIKED_COMMENT":
      return `${notif.associate.name} liked your comment.`;
    case "COMMENTED_ON_POST":
      return `${notif.associate.name} commented on your post.`;
    default:
      return `Unknown notification type.`;
  }
};

export default generateNotifContent;
