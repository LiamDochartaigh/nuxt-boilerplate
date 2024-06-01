import { IsDefined } from "class-validator";

interface Product {
  product_ID: string;
  quantity: number;
  unit_Price: number;
  name: string;
}

export class Order {
  @IsDefined()
  _id: string;
  @IsDefined()
  order_Total: number;
  @IsDefined()
  products: Product[];

  constructor(id: string, order_Total: number, products: Product[]) {
    this._id = id;
    this.order_Total = order_Total;
    this.products = products;
  }
}

export async function GetOrder(sessionId: string) {
  try {
    const { data } = await useFetch(`/api/order/retrieve`, {
      method: "POST",
      body: {
        checkout_session_id: sessionId,
      },
    });
    if (data.value && data.value.order) {
      const order = await validateAndTransform(Order, data.value.order as Order);
      return order;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export default {
  GetOrder,
};
