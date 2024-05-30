import zod from "zod";
import { GetOrderBySessionID } from "~/server/services/orderService";
import { H3Error } from "h3";

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
      if (e instanceof H3Error) {
        console.error("Validation Error:", e.data);
        throw createError({status: e.statusCode, message: e.statusMessage});
      } else if (e instanceof Error) {
        console.error("Error Fetching Order:", e.message);
        throw createError({status: 401, message: "An error occured. Please Try Again Later."});
      } else {
        console.error("Unexpected error:", e);
        throw createError({status: 500, message: "Internal Server Error."});
      }
    }
  },
});
