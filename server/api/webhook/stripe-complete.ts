import { StripeCheckoutComplete } from "~/server/services/paymentService";

export default defineEventHandler(async (event) => {
    try{
        event.node.req.headers
        const signature = getHeader(event, "stripe-signature");
        if(!signature) { throw createError({ statusCode: 400, message: "Validation Error" }); }
        const body = (await readRawBody(event))?.toString();
        if(!body) { throw createError({ statusCode: 400, message: "Validation Error" }); }
        await StripeCheckoutComplete(body, signature);
        return {statusCode: 200}

    }catch(e){
        if (e instanceof Error) {
            console.error("Error Processing Checkout Complete Webhook: ", e.message);
            throw createError({ statusCode: 400, message: "Webhook Error" });
        } else {
            console.error("Unexpected error:", e);
            throw createError({ statusCode: 500, message: "Webhook Error" });
        }
    }
});