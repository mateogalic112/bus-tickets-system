import jwtConfig from "../config/jwt";

export const tokenCookieOptions = {
  maxAge: +jwtConfig.expiresIn,
  secure: true,
  httpOnly: true,
  path: "/",
};

export const logoutCookieOptions = {
  maxAge: 0,
  path: "/",
};
