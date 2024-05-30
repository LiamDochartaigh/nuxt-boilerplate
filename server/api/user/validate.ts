import { create } from "domain";

export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    if (event.context.user) {
      return {
        statusCode: 200,
        body: event.context.user,
      };
    } else {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized User" });
    }
  },
});
