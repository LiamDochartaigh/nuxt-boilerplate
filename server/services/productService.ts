import { Product } from '../models/productModel';
import mongoose from 'mongoose';

export async function GetProduct(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return await Product.findById(id);
    } else {
        throw new Error('Invalid Product ID');
    }
}

export async function GetProducts() {
    return await Product.find();
}

export default {
    GetProduct, 
    GetProducts 
};