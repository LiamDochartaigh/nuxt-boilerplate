
export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    if (!event.context.user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized User" });
    }

    return {
      statusCode: 200,
      user: event.context.user,
    };
  },
});
