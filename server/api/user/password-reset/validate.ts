import zod from "zod";
import { ValidatePasswordResetToken } from "~/server/services/userService";

const validatePasswordResetRequest = zod.object({
  token: zod.string().min(1, { message: "Token is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validatePasswordResetRequest.parse);
    await ValidatePasswordResetToken(body.token);
    return { statusCode: 200};
  } catch (e) {
    if (e instanceof zod.ZodError) {
      const validationErrors = e.errors.map((err) => err.message).join(", ");
      console.error("Validation Error:", validationErrors);
      createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error validating password reset token:", e.message);
      createError({ statusCode: 403, statusMessage: "An error occured. Please Try Again Later." });
    } else {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
  }
});
