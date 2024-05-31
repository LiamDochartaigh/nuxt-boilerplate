import { GetProducts } from "~/server/services/productService";

export default defineEventHandler(async (event) => {
  try {
    const products = await GetProducts();
    return {
      statusCode: 200,
      products: products,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error Retrieving Products: ", e.message);
      throw createError({status: 400, message: "An error occured. Please Try Again Later."});
    } else {
      console.error("Unexpected error:", e);
      throw createError({status: 500, message: "Internal Server Error."});
    }
  }
});
