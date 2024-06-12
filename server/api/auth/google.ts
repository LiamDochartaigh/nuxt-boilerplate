import zod from "zod";
import { AuthGoogle } from "~/server/services/googleAuthService";
import { DefaultCookie } from "~/server/services/authService";
import { H3Error } from "h3";

const validateAuthGoogle = zod.object({
  code: zod.string().min(1, { message: "Code is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validateAuthGoogle.parse);
    const user = await AuthGoogle(body.code);

    setCookie(event, "access-token", user.access_token, DefaultCookie(15 * 60 * 1000));
    setCookie(event, "refresh-token", user.refresh_token, DefaultCookie(7 * 24 * 60 * 60 * 1000));

    return { statusCode: 200, user: user };
  } catch (e) {
    if (e instanceof H3Error) {
      console.error("Validation error:", e.data);
      throw createError({status: e.statusCode, message: e.statusMessage});
    } else if (e instanceof Error) {
      console.error("Error Authorising User:", e.message);
      throw createError({status: 401, message: "An error occured. Please Try Again Later."});
    } else {
      console.error("Unexpected error:", e);
      throw createError({status: 500, message: "Internal Server Error."});
    }
  }
});
