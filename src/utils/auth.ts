import type { User } from "@/types/user.type";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const saveAuth = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
    })
  );
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () =>
  JSON.parse(localStorage.getItem(USER_KEY) || "null");

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => !!getToken();
