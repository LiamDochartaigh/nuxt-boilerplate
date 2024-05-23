import { Schema, model } from 'mongoose';

interface IProduct{
    _id: string;
    name: string;
    description: string;
    price: number;
    image_URL: string;
}

const ProductSchema = new Schema<ProductType>({
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

export type ProductType = IProduct & Document;
export const Product = model<ProductType>("Product", ProductSchema);
export default Product;
