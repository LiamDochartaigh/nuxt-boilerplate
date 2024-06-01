import { Product } from "./productService";

export async function initiateStripePurchase(products: Product[]) {
  try {
    const mappedProducts = products.map((product) => {
      return {
        product_id: product._id,
        quantity: 1,
      };
    });
    const { data } = await useFetch(`/api/payment/stripe-checkout-session/`, {
      method: "POST",
      body: {
        products: mappedProducts,
        success_url: import.meta.env.VITE_APP_BASE_URL + "order-complete",
        cancel_url: import.meta.env.VITE_APP_BASE_URL,
      },
    });
    if (data.value && data.value.stripe_session_url) {
      return data.value.stripe_session_url;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export default { initiateStripePurchase };
