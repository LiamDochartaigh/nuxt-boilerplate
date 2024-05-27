import zod from "zod";
import { IProduct } from "~/server/models/productModel";
import { IStripeLineItem, StripeCheckoutSession } from "~/server/services/paymentService";
import { GetProduct } from "~/server/services/productService";

const productSchema = zod.object({
  product_id: zod.string().min(1, { message: "Product ID must be a string" }),
  product_quantity: zod.number().int().positive({ message: "Product quantity must be a positive integer" }),
});

const validateStripeCheckout = zod.object({
  products: zod.array(productSchema, { required_error: "Products must be an array" }),
  success_url: zod.string().url({ message: "Success URL must be a valid URL" }),
  cancel_url: zod.string().url({ message: "Cancel URL must be a valid URL" }),
});

export default defineEventHandler({
  onRequest: authAPI,
  handler: async (event) => {
    try {
      const body = await readValidatedBody(event, validateStripeCheckout.parse);
      const formattedProducts: IStripeLineItem[] = await Promise.all(
        body.products.map(async (productData) => {
          const product = await GetProduct(productData.product_id);
          if (!product) {
            throw new Error("Product not found");
          }
          const formattedProduct: IProduct = {
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image_URL: product.image_URL,
          };
          return { product: formattedProduct, quantity: productData.product_quantity };
        })
      );
      const stripeSession = await StripeCheckoutSession(event.context.user, formattedProducts, body.success_url, body.cancel_url);
      return {
        statusCode: 200,
        body: stripeSession.url,
      };
    } catch (e) {
      if (e instanceof zod.ZodError) {
        console.error("Error Validating Stripe Checkout Request:", e.errors);
        createError({ statusCode: 400, message: "An error occured. Please Try Again Later." });
      } else if (e instanceof Error) {
        console.error("Error Initiating Stripe Checkout:", e.message);
        createError({ statusCode: 401, message: "An error occured. Please Try Again Later." });
      } else {
        console.error("Unexpected error:", e);
        createError({ statusCode: 500, message: "An error occured. Please Try Again Later." });
      }
    }
  },
});
