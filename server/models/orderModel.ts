import { Schema, model } from 'mongoose';

export interface IOrderProduct {
    product_ID: Schema.Types.ObjectId;
    name: string;
    quantity: number;
    unit_Price: number;
}

export interface IOrder {
    user_Id: Schema.Types.ObjectId;
    customer_email: string;
    products: IOrderProduct[];
    order_Total: number;
    purchase_Date: Date;
    status: string;
    payment_Method: string;
    internal_Session_ID: string;
    stripe_Session_ID: string;
    notes: string;
    currency: string;
}

const OrderSchema = new Schema<IOrder>({
    user_Id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customer_email: {
        type: String,
        required: true,
    },
    products: [
        {
            product_ID: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            unit_Price: {
                type: Number,
                required: true,
            }
        }
    ],
    order_Total: {
        type: Number,
        required: true,
    },
    purchase_Date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'cancelled'],
    },
    payment_Method: {
        type: String,
        required: true,
        enum: ['Stripe', 'PayPal'],
    },
    internal_Session_ID: {
        type: String,
        required: true,
    },
    stripe_Session_ID: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
    currency:{
        type: String,
        required: true,
        default: 'usd',
        enum: ['usd', 'eur', 'gbp']
    }
}, { timestamps: true });

OrderSchema.set('toJSON', {
    transform: function(doc, ret) {
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
      delete ret.stripe_Session_ID;
      delete ret.internal_Session_ID;
      delete ret.user_Id;
      delete ret.customer_email
      return ret;
    }
  });
  

const Order = model<IOrder>("Order", OrderSchema);

export { Order };