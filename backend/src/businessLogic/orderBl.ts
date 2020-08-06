import { CreateOrderRequest } from '../requests/CreateOrderRequest';
import { Order } from '../models/Order';
import { OrderTbl } from '../dataLayer/OrderTbl';
import { SeqTbl } from '../dataLayer/SeqTbl';
import { createLogger } from '../utils/logger';

const logger = createLogger("OrderBl");
// Can not delete Order once created, only deactivation allowed.

export async function createOrder(orderReq: CreateOrderRequest): Promise<Order> {
    logger.debug("createOrder - in");

    const newOrderNum: number = await new SeqTbl().getNextSeqForStoreOrder(orderReq.storeNum);

    const order: Order = {
        userId: orderReq.userId,        
        storeNum: orderReq.storeNum,
        orderNum: newOrderNum,
        items: orderReq.itms,
        totalPrice: orderReq.totalAmt,
        lastUpdatedAt: new Date().toISOString(),        
    }

    const order1: Order = await new OrderTbl().createOrder(order);
    logger.debug("createOrder - out");
    return order1;
}

export async function updateOrder(orderReq: CreateOrderRequest): Promise<Order> {
    logger.debug("updateOrder - in");

    const order: Order = {
        userId: orderReq.userId,        
        storeNum: orderReq.storeNum,
        orderNum: orderReq.orderNum,
        items: orderReq.itms,
        totalPrice: orderReq.totalAmt,
        lastUpdatedAt: new Date().toISOString(),        
    }


    const order1: Order = await new OrderTbl().updateOrder(order);
    logger.debug("updateOrder - out");
    return order1;
}

export async function getOrder(storeNum: number, orderNum:number): Promise<Order> {
    logger.debug("getOrder - in");
    var order1: Order = await new OrderTbl().getOrder(storeNum, orderNum);

    if (order1 == null) {
        order1 = null;
    }

    logger.debug("getOrder - out");
    return order1;
}

export async function getOrderById(orderId: string): Promise<Order> {
    logger.debug("getOrderById - in");
    var order1: Order = await new OrderTbl().getOrderById(orderId);

    if (order1 == null) {
        order1 = null;
    }

    logger.debug("getOrderById - out");
    return order1;
}