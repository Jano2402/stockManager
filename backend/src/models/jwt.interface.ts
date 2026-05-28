export type AuthUser = {
  id: number;
  username: string;
  role: "USER" | "ADMIN" | "MODERATOR";
};

export type JwtPayload = AuthUser & {
  iat: number;
  exp: number;
};
