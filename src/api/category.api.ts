import { http } from "./http";

export interface CategoryItem {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export const fetchCategories = async () => {
  const response = await http.get("/categories");
  return response.data.data;
};
