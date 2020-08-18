import { UpdateCartRequest } from '../requests/UpdateCartRequest';
import { Cart } from '../models/Cart';
import { CartTbl } from '../dataLayer/CartTbl';
import { createLogger } from '../utils/logger';

const logger = createLogger("CartBl");
// Can not delete Item once created, only deactivation allowed.

export async function createCart(cartReq: UpdateCartRequest, uid: string): Promise<Cart> {
    logger.debug("createItem - in");

    const cart: Cart = {
        userId: uid,
        storeNum: cartReq.storeNum,
        items: cartReq.itms,
        totalPrice: cartReq.totalAmt,
        lastUpdatedAt: new Date().toISOString()        
    }

    const cart1: Cart = await new CartTbl().upsertCart(cart);
    logger.debug("createItem - out");
    return cart1;
}

export async function updateCart(uid: string, cartReq: UpdateCartRequest): Promise<Cart> {
    logger.debug("updateItem - in");

    const cart: Cart = {
        userId: uid,        
        storeNum: cartReq.storeNum,
        items: cartReq.itms,
        totalPrice: cartReq.totalAmt,
        lastUpdatedAt: new Date().toISOString()    
    }


    const cart1: Cart = await new CartTbl().upsertCart(cart);
    logger.debug("updateItem - out");
    return cart1;
}

export async function getCart(uid: string, storeNum: number): Promise<Cart> {
    logger.debug("updateItem - in");
    var cart1: Cart = await new CartTbl().getCart(uid, storeNum);

    if (cart1 == null) {
        cart1 = {
            userId: uid,        
            storeNum: storeNum,
            items: null,
            totalPrice: 0,
            lastUpdatedAt: new Date().toISOString(),        
        }
    }

    logger.debug("updateItem - out");
    return cart1;
}