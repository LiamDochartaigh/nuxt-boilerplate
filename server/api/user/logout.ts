import userService from "~/server/services/userService";

export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    try {
      await userService.LogOutUser(event.context.user);
      deleteCookie(event, "access-token");
      deleteCookie(event, "refresh-token");
      return { statusCode: 200 };
    } catch (e) {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, statusMessage: "Internal Server Error" });
    }
  },
});
