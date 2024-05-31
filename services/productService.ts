import { baseAXios } from "../services/axiosService";
import { IsDefined } from 'class-validator';

export class Product {
    @IsDefined()
    _id: string;
    @IsDefined()
    name: string;
    @IsDefined()
    description: string;
    @IsDefined()
    price: number;
    @IsDefined()
    image_URL: string;

    constructor(id: string, name: string, description: string, price: number, image_URL: string) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image_URL = image_URL;
    }
}

export async function getProducts() {
    try {
        const { data } = await useFetch(`/api/product/`);
        if (data.value && data.value.products) {
            const products: Product[] = await Promise.all(
                data.value.products.map(async (product) => {
                    const transformedProduct = await validateAndTransform(Product, product as Product);
                    return transformedProduct;
                })
            );
            return products;
        }
    } catch (e: any) {
        console.error(e.message);
    }
}

export default {
    getProducts
}