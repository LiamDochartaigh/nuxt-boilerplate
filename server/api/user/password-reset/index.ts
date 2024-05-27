import zod from "zod";
import { ResetUserPasswordRequest } from "~/server/services/userService";

const validatePasswordResetRequest = zod.object({
  email: zod.string().email({ message: "Email must be a valid email address" }).min(1, { message: "Email is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validatePasswordResetRequest.parse);
    await ResetUserPasswordRequest(body.email);
    return { statusCode: 200, body: { message: "Password reset request sent." } };
  } catch (e) {
    if (e instanceof zod.ZodError) {
      const validationErrors = e.errors.map((err) => err.message).join(", ");
      console.error("Validation error:", validationErrors);
      createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error Resetting Password:", e);
      createError({ statusCode: 403, statusMessage: "An error occured. Please Try Again Later." });
    } else {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
  }
});
