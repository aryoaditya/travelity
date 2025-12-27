import type { CategoryItem } from "@/api/category.api";
import type { Comment } from "./comment.type";
import type { User } from "./user.type";

export interface Post {
  id: number;
  documentId: string;
  category: CategoryItem;
  title: string;
  description: string;
  image: string;
  comments: Comment[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  timeAgo: string;
  user: User;
}
