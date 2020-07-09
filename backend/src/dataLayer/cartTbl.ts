import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {Cart} from '../models/Cart'

const logger = createLogger("cartTbl");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

let dbDocClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
    dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: c.LOCAL_DYNAMODB_EP});
} else {
    dbDocClient = new AWS.DynamoDB.DocumentClient();
}

export async function upsertCart(cart :Cart): Promise<Cart> {
    logger.debug("cartTbl.upsertCart - in");

    await dbDocClient.put({
        TableName: c.TBL_CART,
        Item: cart
    }).promise();

    logger.debug("cartTbl.upsertCart - out");
    return cart;
}

export async function getCart(userId: string, storeNum: number): Promise<Cart> {
    logger.debug("cartTbl.getCart - in");

    const result = await dbDocClient.get({
        TableName: c.TBL_CART,
        Key: {
            userId: userId,
            storeNum: storeNum
        }
    }).promise();

    logger.debug("cartTbl.getCart - out");
    return result.Item as Cart;
}


export async function deleteCart(userId: string, storeNum: number): Promise<void> {
    logger.debug("cartTbl.deleteCart - in");

    await dbDocClient.delete({ TableName: c.TBL_CART, Key: { userId: userId, storeNum: storeNum } }).promise();

    logger.debug("cartTbl.deleteCart - out");
}