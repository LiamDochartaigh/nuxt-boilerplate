import { SendEmailConfirmation } from "~/server/services/userService";

export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    try {
      await SendEmailConfirmation(event.context.user);
      return { statusCode: 200};
    } catch (e) {
      console.error("Error sending confirmation email:", e);
      throw createError({ statusCode: 401, statusMessage: "An error occured. Please Try Again Later." });
    }
  },
});
