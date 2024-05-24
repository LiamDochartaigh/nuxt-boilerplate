import zod from "zod";
import { ActivateAccount } from "~/server/services/userService";

const validateConfirmationToken = zod.object({
  token: zod.string().min(1, { message: "Confirmation token is required" }),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, validateConfirmationToken.parse);
    await ActivateAccount(body.token);
    return {
      statusCode: 200,
      body: { message: "Email confirmed." },
    };
  } catch (e) {
    if (e instanceof zod.ZodError) {
      const validationErrors = e.errors.map((err) => err.message).join(", ");
      console.error("Validation error:", validationErrors);
      createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error Confirming Email:", e);
      createError({ statusCode: 401, statusMessage: "An error occured. Please Try Again Later." });
    }
  }
});
