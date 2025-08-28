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
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
