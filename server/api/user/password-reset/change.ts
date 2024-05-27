import zod from "zod";
import { ChangePassword } from "~/server/services/userService";

const validatePasswordChange = zod.object({
  token: zod.string().min(1, { message: "Token is required" }),
  password: zod.string().min(1, { message: "Password is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validatePasswordChange.parse);
    await ChangePassword(body.token, body.password);
    return { statusCode: 200};
  } catch (e) {
    if (e instanceof zod.ZodError) {
      const validationErrors = e.errors.map((err) => err.message).join(", ");
      console.error("Validation Error:", validationErrors);
      createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error changing password:", e.message);
      createError({ statusCode: 403, statusMessage: "An error occured. Please Try Again Later." });
    } else {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
  }
});
