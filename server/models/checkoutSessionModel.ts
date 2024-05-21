import {Enums} from 'mailgun.js';
import { Schema, model } from 'mongoose';

const CheckoutSessionSchema = new Schema({
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

const CheckoutSession = model("CheckoutSession", CheckoutSessionSchema);
module.exports = { CheckoutSession };