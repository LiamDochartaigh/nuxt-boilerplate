import zod from "zod";
import { ValidatePasswordResetToken } from "~/server/services/userService";
import { H3Error } from "h3";

const validatePasswordResetRequest = zod.object({
  token: zod.string().min(1, { message: "Token is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validatePasswordResetRequest.parse);
    const isValid = await ValidatePasswordResetToken(body.token);
    if(!isValid) { throw new Error("Invalid password reset token"); }
    return { statusCode: 200};
  } catch (e) {
    if (e instanceof H3Error) {
      console.error("Validation Error:", e.data);
      throw createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error validating password reset token:", e.message);
      throw createError({ statusCode: 403, statusMessage: "An error occured. Please Try Again Later." });
    } else {
      console.error("Unexpected error:", e);
      throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
  }
});
