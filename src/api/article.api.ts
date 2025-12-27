import type { Comment } from "@/types/comment.type";
import { http } from "./http";
import type { CategoryItem } from "./category.api";
import type { User } from "@/types/user.type";

export interface ArticleItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  comments: Comment[];
  category: CategoryItem;
  user: User;
}

export interface ArticleCreateUpdateDto {
  title: string;
  description: string;
  cover_image_url: string;
  category: number;
}

export const fetchArticles = async (page = 1, query = "") => {
  const response = await http.get("/articles", {
    params: {
      "pagination[page]": page,
      "pagination[pageSize]": 10,
      "populate[comments][populate][user]": "*",
      "populate[user]": "*",
      "populate[category]": "*",
      "filters[title][$containsi]": query,
    },
  });
  return response.data.data;
};

export const fetchArticleById = async (id: string): Promise<ArticleItem> => {
  const res = await http.get(`/articles/${id}`);
  return res.data.data;
};

export const createArticle = async (
  data: ArticleCreateUpdateDto
): Promise<ArticleItem> => {
  const res = await http.post("/articles", {
    data,
  });
  return res.data.data;
};

export const updateArticle = async (
  id: string,
  data: ArticleCreateUpdateDto
): Promise<ArticleItem> => {
  const res = await http.put(`/articles/${id}`, {
    data,
  });
  return res.data.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  await http.delete(`/articles/${id}`);
};
