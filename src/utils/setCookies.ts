import { Response } from "express";

export interface IAuthCookies {
  res: Response;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const setCookies = ({
  res,
  role,
  accessToken,
  refreshToken,
}: IAuthCookies) => {
    if (role) {
    res.cookie("role", role, {
      httpOnly: false,
      secure: false,
    });
  }

  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
