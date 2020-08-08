import { UpdateCartRequest } from '../requests/UpdateCartRequest';
import { Cart } from '../models/Cart';
import { CartTbl } from '../dataLayer/CartTbl';
import { UserTbl } from '../dataLayer/UserTbl';
import { createLogger } from '../utils/logger';

const logger = createLogger("CartBl");
// Can not delete Item once created, only deactivation allowed.

export async function createCart(cartReq: UpdateCartRequest, uid: string): Promise<Cart> {
    logger.debug("createItem - in");

    const unum: number = (await new UserTbl().getUserById(uid)).userNum;

    const cart: Cart = {
        userNum: unum,        
        storeNum: cartReq.storeNum,
        items: cartReq.itms,
        totalPrice: cartReq.totalAmt,
        lastUpdatedAt: new Date().toISOString(),        
    }

    const cart1: Cart = await new CartTbl().upsertCart(cart);
    logger.debug("createItem - out");
    return cart1;
}

export async function updateCart(uid: string, cartReq: UpdateCartRequest): Promise<Cart> {
    logger.debug("updateItem - in");
    const uNum: number = (await new UserTbl().getUserById(uid)).userNum;
    const cart: Cart = {
        userNum: uNum,        
        storeNum: cartReq.storeNum,
        items: cartReq.itms,
        totalPrice: cartReq.totalAmt,
        lastUpdatedAt: new Date().toISOString(),        
    }


    const cart1: Cart = await new CartTbl().upsertCart(cart);
    logger.debug("updateItem - out");
    return cart1;
}

export async function getCart(uid: string, storeNum: number): Promise<Cart> {
    logger.debug("updateItem - in");
    const uNum: number = (await new UserTbl().getUserById(uid)).userNum;

    var cart1: Cart = await new CartTbl().getCart(uNum, storeNum);

    if (cart1 == null) {
        cart1 = {
            userNum: uNum,        
            storeNum: storeNum,
            items: null,
            totalPrice: 0,
            lastUpdatedAt: new Date().toISOString(),        
        }
    }

    logger.debug("updateItem - out");
    return cart1;
}