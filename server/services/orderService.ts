import {Order, IOrderProduct} from '../models/orderModel';
import {sendNewOrderEmail} from './emailService';

export async function CreateOrder(
    userID: string,
    customerEmail: string,
    products: IOrderProduct[],
    totalCost: number,
    purchaseDate: Date,
    status: string,
    paymentMethod: string,
    stripeSessionID: string,
    internalSessionID: string,
    notes: string)
    {
    
    const order = await Order.create({
        user_Id: userID,
        customer_email: customerEmail,
        products: products,
        order_Total: totalCost,
        purchase_Date: purchaseDate,
        status: status,
        payment_Method: paymentMethod,
        stripe_Session_ID: stripeSessionID,
        internal_Session_ID: internalSessionID,
        notes: notes
    });

    //Send order email to user
    await sendNewOrderEmail(order.customer_email, order);
    return await order.save();
}

//Only valid user should be able to fetch order
export async function GetOrderBySessionID(sessionID: string, userId: string) {
    return await Order.findOne({internal_Session_ID: sessionID, user_Id: userId});
}

export default {
    CreateOrder,
    GetOrderBySessionID
}