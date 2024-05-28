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
      console.error("Error Retrieving Products: ", e.message);
      createError({ statusCode: 400, message: "An Error Occured. Please Try Again." });
    } else {
      console.error("Unexpected error:", e);
      createError({ statusCode: 500, message: "An Error Occured. Please Try Again." });
    }
  }
});
