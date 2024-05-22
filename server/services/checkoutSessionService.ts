import { CheckoutSession} from '../models/checkoutSessionModel';

export async function CreateCheckoutSession(userId: string, type: string){
    const internalSession = await CheckoutSession.create({
        user_Id: userId,
        status: "pending",
        session_type: type
    });
    return await internalSession.save();
}

export async function CloseCheckoutSession(sessionId: string){
    const internalSession = await CheckoutSession.findById(sessionId);
    if(!internalSession) throw new Error("Session not found");
    internalSession.status = "completed";
    internalSession.save();
}

export default {
    CreateCheckoutSession,
    CloseCheckoutSession
}