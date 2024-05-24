
export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    if (event.context.user) {
      return {
        statusCode: 200,
        body: event.context.user,
      };
    } else {
      return {
        statusCode: 401,
        body: "Unauthorized User",
      };
    }
  },
});
