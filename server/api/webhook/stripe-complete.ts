import { StripeCheckoutComplete } from "~/server/services/paymentService";

export default defineEventHandler(async (event) => {
    try{
        const signature = getHeader(event, "stripe-signature");
        if(!signature) { throw new Error("No signature provided") }
        const body = readRawBody(event).toString();
        await StripeCheckoutComplete(body, signature);
        return {statusCode: 200}

    }catch(e){
        if (e instanceof Error) {
            console.error("Error Processing Checkout Complete Webhook: ", e.message);
            createError({ statusCode: 400, message: "Webhook Error" });
        } else {
            console.error("Unexpected error:", e);
            createError({ statusCode: 500, message: "Webhook Error" });
        }
    }
});