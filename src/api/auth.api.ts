import { http } from "./http";
import qs from "qs";

export const login = async (identifier: string, password: string) => {
  const { data } = await http.post(
    "/auth/local",
    qs.stringify({ identifier, password })
  );
  return data;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const { data } = await http.post(
    "/auth/local/register",
    qs.stringify({ username, email, password })
  );
  return data;
};
