import { http } from "./http";

export const getMe = async () => {
  const { data } = await http.get("/users/me");
  return data;
};
