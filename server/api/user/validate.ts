
export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    if (!event.context.user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized User" });
    }
    event.context.user = await validateAndTransform(User, event.context.user as User);
    return {
      statusCode: 200,
      user: test,
    };
  },
});
