import { Schema, model } from 'mongoose';

interface ICheckoutSession {
    user_Id: Schema.Types.ObjectId;
    status: string;
    session_type: string;
}

const CheckoutSessionSchema = new Schema<CheckoutSessionType>({
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

export type CheckoutSessionType = ICheckoutSession & Document;
const CheckoutSession = model<CheckoutSessionType>("CheckoutSession", CheckoutSessionSchema);

export default CheckoutSession;

export {
    CheckoutSession
}