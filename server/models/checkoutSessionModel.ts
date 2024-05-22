import { Schema, model } from 'mongoose';

export interface ICheckoutSession {
    user_Id: Schema.Types.ObjectId;
    status: string;
    session_type: string;
}

const CheckoutSessionSchema = new Schema<ICheckoutSession>({
    user_Id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        Enums: ['pending', 'completed', 'cancelled'],
    },
    session_type: {
        type: String,
        required: true,
        default: 'stripe',
        Enums: ['stripe', 'paypal'],
    },
}, { timestamps: true });

const CheckoutSession = model<ICheckoutSession>("CheckoutSession", CheckoutSessionSchema);

export default CheckoutSession;

export {
    CheckoutSession
}