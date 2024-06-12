import { Product } from "./productService";

export async function initiateStripePurchase(products: Product[], base_url: string) {
  try {
    const mappedProducts = products.map((product) => {
      return {
        product_id: product._id,
        quantity: 1,
      };
    });
    const { stripe_session_url } = await $fetch(`/api/payment/stripe-checkout-session`, {
      method: "POST",
      body: {
        products: mappedProducts,
        success_url: base_url + "/order-complete",
        cancel_url: base_url,
      },
    });
    if (stripe_session_url) {
      return stripe_session_url;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export default { initiateStripePurchase };
