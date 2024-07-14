import { formatDistanceToNow } from "date-fns";

const getTimeAgo = (date: Date): string =>
  formatDistanceToNow(date, { addSuffix: true });

export default getTimeAgo;
