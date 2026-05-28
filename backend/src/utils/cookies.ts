// src/utils/cookies.ts
export const cookieOptions = (isProduction: boolean) => ({
  httpOnly: true,
  secure: isProduction, // true en prod
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/",
});
