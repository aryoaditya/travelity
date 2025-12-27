import type { Comment } from "@/types/comment.type";
import { http } from "./http";

export interface CreateCommentDto {
  content: string;
  article: number;
}

export interface UpdateCommentDto {
  content: string;
}

export const createComment = async (
  data: CreateCommentDto
): Promise<Comment> => {
  const res = await http.post("/comments", {
    data,
  });
  return res.data.data;
};

export const updateComment = async (
  id: string,
  data: UpdateCommentDto
): Promise<Comment> => {
  const res = await http.put(`/comments/${id}`, {
    data,
  });
  return res.data.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await http.delete(`/comments/${id}`);
};
