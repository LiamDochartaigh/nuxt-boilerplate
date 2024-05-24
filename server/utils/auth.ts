import { ValidateUser, RefreshUser } from "../services/userService";
import { DefaultCookie } from "../services/authService";

export const authAPI = defineEventHandler(async (event) => {
  try {
    const accessToken = getCookie(event, "access-token");
    const refreshToken = getCookie(event, "refresh-token");

    if (!accessToken || !refreshToken) {
      throw new Error("Unauthorized User");
    }

    let user = await ValidateUser(accessToken);

    if (!user) {
      user = await RefreshUser(refreshToken);
      setCookie(event, "access-token", user.access_token, DefaultCookie(15 * 60 * 1000));
      setCookie(event, "refresh-token", user.refresh_token, DefaultCookie(7 * 24 * 60 * 60 * 1000));
    }
    event.context.user = user;
  } catch (e) {
    console.error("Error refreshing user: ", e);
    createError({ statusCode: 401, statusMessage: "An error occured. Please Try Again Later." });
  }
});
