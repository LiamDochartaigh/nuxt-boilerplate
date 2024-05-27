import zod from "zod";
import { GetOrderBySessionID } from "~/server/services/orderService";

const validateCreateOrder = zod.object({
  checkout_session_id: zod.string().min(1, { message: "Order Session ID Required" }),
});

export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    try {
      const body = await readValidatedBody(event, validateCreateOrder.parse);
      const user = event.context.user;
      const order = await GetOrderBySessionID(body.checkout_session_id, user._id);
      return { statusCode: 200, body: order };
    } catch (e) {
      if (e instanceof zod.ZodError) {
        const validationErrors = e.errors.map((err) => err.message).join(", ");
        console.error("Validation Error:", validationErrors);
        createError({ statusCode: 400, statusMessage: "An error occured. Please Try Again Later." });
      } else if (e instanceof Error) {
        console.error("Error Fetching Order:", e.message);
        createError({ statusCode: 401, statusMessage: "An error occured. Please Try Again Later." });
      } else {
        console.error("Unexpected error:", e);
        createError({ statusCode: 500, statusMessage: "Internal Server Error" });
      }
    }
  },
});
