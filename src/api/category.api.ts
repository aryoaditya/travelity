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

export const fetchCategories = async (page = 1, pageSize?: number) => {
  const params: any = {
    "pagination[page]": page,
  };

  if (pageSize !== undefined) {
    params["pagination[pageSize]"] = pageSize;
  }

  const response = await http.get("/categories", { params });
  return response.data.data;
};
