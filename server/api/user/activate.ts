import zod from "zod";
import { ActivateAccount } from "~/server/services/userService";
import { H3Error } from "h3";

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
    if (e instanceof H3Error) {
      console.error("Validation error:", e.data);
      throw createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
    } else if (e instanceof Error) {
      console.error("Error Confirming Email:", e);
      throw createError({ statusCode: 401, statusMessage: "An error occured. Please Try Again Later." });
    }
  }
});
