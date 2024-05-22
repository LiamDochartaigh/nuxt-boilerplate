import { Schema, model } from 'mongoose';

export interface IProduct {
    name: string;
    description: string;
    price: number;
    image_URL: string;
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image_URL: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Product = model<IProduct>("Product", ProductSchema);
export default Product;
