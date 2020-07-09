import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {Order} from '../models/Order'

const logger = createLogger("orderTbl");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

let dbDocClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
    dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: c.LOCAL_DYNAMODB_EP});
} else {
    dbDocClient = new AWS.DynamoDB.DocumentClient();
}

export async function createOrder(order :Order): Promise<Order> {
    logger.debug("orderTbl.createOrder - in");

    await dbDocClient.put({
        TableName: c.TBL_ORDER,
        Item: order,
        ConditionExpression: "attribute_not_exists(orderNum)"
    }).promise();

    logger.debug("orderTbl.createOrder - out");
    return order;
}

// Updates only status
export async function updateOrder(order :Order): Promise<Order> {
    logger.debug("orderTbl.updateOrder - in");

    await dbDocClient.update({
        TableName: c.TBL_ORDER,
        Key: {userId: order.userId, storeNum: order.storeNum, orderNum: order.orderNum},
        UpdateExpression: "set status = :val1",
        ExpressionAttributeValues: {
            ":val1": {"S": order.status}
        },
        ReturnValues: "ALL_NEW"
    }).promise();

    logger.debug("orderTbl.updateOrder - out");
    return order;
}

export async function getOrder(userId: string, storeNum: number, orderNum: number): Promise<Order> {
    logger.debug("orderTbl.getOrder - in");

    const result = await dbDocClient.get({
        TableName: c.TBL_ORDER,
        Key: {
            userId: userId,
            storeId: storeNum,
            oderNum: orderNum            
        }
    }).promise();

    logger.debug("orderTbl.getOrder - out");
    return result.Order as Order;
}

// Once created Order can not be deleted.
// export async function deleteOrder(userId: string, storeId: number, orderNum: number): Promise<void> {
//     logger.debug("orderTbl.deleteOrder - in");

//     await dbDocClient.delete({ TableName: c.TBL_ORDER, Key: { userId,  storeId, orderNum } }).promise();

//     logger.debug("orderTbl.deleteOrder - out");
// }