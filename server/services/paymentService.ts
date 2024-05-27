import Stripe from 'stripe'
import { UserType } from '../models/userModel';
import { CreateOrder } from './orderService';
import { CreateCheckoutSession, CloseCheckoutSession } from '../services/checkoutSessionService';
import {GetUserById} from '../services/userService';
import { IProduct } from '../models/productModel';
import { IOrderProduct } from '../models/orderModel';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripe_secret_key);

export interface IStripeLineItem{
    quantity: number;
    product: IProduct
}

export async function StripeCheckoutSession(user: UserType, lineItems: IStripeLineItem[],
     successURL: string, cancelURL: string) {
    
    //Create internal checkout session that we can use to track the order
    const internalSession = await CreateCheckoutSession(user.id, "stripe")
    
    const line_items = lineItems.map((lineItem) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: lineItem.product.name,
                    description: lineItem.product.description,
                    images: [lineItem.product.image_URL],
                    metadata: {
                        product_id: lineItem.product._id.toString()
                    }
                },
                unit_amount: lineItem.product.price,
            },
            quantity: lineItem.quantity,
        }
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        metadata: {
            internal_session_id: internalSession.id.toString()
        },
        client_reference_id: user.id.toString(),
        customer_email: user.email,
        line_items: line_items,
        mode: 'payment',
        success_url: `${successURL}?session_id=${internalSession.id.toString()}`,
        cancel_url: cancelURL,
        tax_id_collection: {
            enabled: true,
        }
    });
    return session;
}

export async function StripeCheckoutComplete(requestBody: string, signature: string) {
    let event;
    const webhookSecret = config.stripe_webhook_secret;
    event = stripe.webhooks.constructEvent(requestBody, signature, webhookSecret);
    if (!event) { throw new Error("Error: Webhook event not constructed"); }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items', 'line_items.data.price.product']
        });

        if(!retrievedSession) { throw new Error("Session not found"); }
        if(!retrievedSession.line_items) { throw new Error("No line items found in order"); }
        if(retrievedSession.line_items?.data.length === 0) { throw new Error("No products found in order"); }

        const productsData: IOrderProduct[] = retrievedSession.line_items?.data.map((product) => {

            const stripeProduct = product.price?.product as Stripe.Product;
            
            const transformedProduct: IOrderProduct = {
                product_ID: stripeProduct?.metadata?.product_id,
                quantity: product.quantity!,
                unit_Price: product.price?.unit_amount!,
                name: stripeProduct?.name
            }
            return transformedProduct;
        });

        const sessionID = retrievedSession.metadata?.internal_session_id;
        if(!sessionID) { throw new Error("Internal session ID not found") }
        if(!retrievedSession.client_reference_id) { throw new Error("Client reference ID not found") }

        await CloseCheckoutSession(sessionID);
        const user = await GetUserById(retrievedSession.client_reference_id);

        if(!user) { throw new Error("User not found from order"); }

        const clientID = retrievedSession.client_reference_id;

        if(!clientID) { throw new Error("Client ID not found from order"); }
         
        await CreateOrder(
            clientID,
            user.email,
            productsData,
            retrievedSession.amount_total!,
            new Date(),
            "completed",
            "Stripe",
            retrievedSession.id,
            sessionID,
            ""
        );
    }
}

module.exports = {
    StripeCheckoutSession,
    StripeCheckoutComplete
}