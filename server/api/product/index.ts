import { GetProducts } from "~/server/services/productService";

export default defineEventHandler(async (event) => {
  try {
    const products = await GetProducts();
    return {
      statusCode: 200,
      body: products,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error Processing Checkout Complete Webhook: ", e.message);
      createError({ statusCode: 400, message: "Webhook Error" });
    } else {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, message: "Webhook Error" });
    }
  }
});
