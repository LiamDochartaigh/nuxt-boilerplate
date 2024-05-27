import zod from "zod";
import { AuthGoogle } from "~/server/services/googleAuthService";
import { DefaultCookie } from "~/server/services/authService";

const validateAuthGoogle = zod.object({
  code: zod.string().min(1, { message: "Code is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validateAuthGoogle.parse);
    const user = await AuthGoogle(body.code);
    setCookie(event, "access-token", user.access_token, DefaultCookie(15 * 60 * 1000));
    setCookie(event, "refresh-token", user.refresh_token, DefaultCookie(7 * 24 * 60 * 60 * 1000));
    return { statusCode: 200, body: user };
  } catch (e) {
    if (e instanceof zod.ZodError) {
      const validationErrors = e.errors.map((err) => err.message).join(", ");
      console.error("Validation error:", validationErrors);
      createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error Authorising User:", e.message);
      createError({ statusCode: 401, statusMessage: "An error occured. Please Try Again Later." });
    } else {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
  }
});