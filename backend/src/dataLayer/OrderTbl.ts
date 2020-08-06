import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import { Order } from '../models/Order'

/*
OrderTbl:
Pk: orderId (storeNum + orderNum, see getOrderId() )
*/

// KeySchema:
// - AttributeName: orderId
//   KeyType: HASH


export class OrderTbl {

    constructor(private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("orderTbl")) { 
    }

    getOrderId(storeNum: number, orderNum: number): string {
        //storeNum(5)-ordernum(10)
        return `${String(storeNum).padStart(5)}-${String(orderNum).padStart(10)}`;
    }

    async createOrder(order: Order): Promise<Order> {
        this.logger.debug("orderTbl.createOrder - in");

        order.orderId = this.getOrderId(order.storeNum, order.orderNum);

        await this.dbDocClient.put({
            TableName: c.TBL_ORDER,
            Item: order,
            ConditionExpression: "attribute_not_exists(orderNum)"
        }).promise();

        this.logger.debug("orderTbl.createOrder - out");
        return order;
    }

    // Updates only status
    async updateOrder(order: Order): Promise<Order> {
        this.logger.debug("orderTbl.updateOrder - in");

        order.orderId = this.getOrderId(order.storeNum, order.orderNum);

        await this.dbDocClient.update({
            TableName: c.TBL_ORDER,
            Key: { userId: order.userId, storeNum: order.storeNum, orderNum: order.orderNum },
            UpdateExpression: "set status = :val1",
            ExpressionAttributeValues: {
                ":val1": { "S": order.status }
            },
            ReturnValues: "ALL_NEW"
        }).promise();

        this.logger.debug("orderTbl.updateOrder - out");
        return order;
    }

    async getOrder(storeNum: number, orderNum: number): Promise<Order> {
        this.logger.debug("orderTbl.getOrder - in");

        const orderId = this.getOrderId(storeNum, orderNum);

        const result = await this.dbDocClient.get({
            TableName: c.TBL_ORDER,
            Key: {
                orderId: orderId
            }
        }).promise();

        this.logger.debug("orderTbl.getOrder - out");
        return result.Order as Order;
    }

    async getOrderById(orderId: string): Promise<Order> {
       this.logger.debug("orderTbl.getOrderById - in");

       const result = await this.dbDocClient.get({
            TableName: c.TBL_ORDER,
            Key: {
                orderId: orderId
            }
        }).promise();

        this.logger.debug("orderTbl.getOrderById - out");
        return result.Order as Order;
    }

    // Once created Order can not be deleted.
    // async deleteOrder(userId: string, storeId: number, orderNum: number): Promise<void> {
    //     this.logger.debug("orderTbl.deleteOrder - in");

    //     await this.dbDocClient.delete({ TableName: c.TBL_ORDER, Key: { userId,  storeId, orderNum } }).promise();

    //     this.logger.debug("orderTbl.deleteOrder - out");
    // }

}


function createDynamoDBClient() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    let dbDocClient: AWS.DynamoDB.DocumentClient;
    if (process.env.IS_OFFLINE) {
        return dbDocClient = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: c.LOCAL_DYNAMODB_EP
        });
    } else {
        return dbDocClient = new AWS.DynamoDB.DocumentClient();
    }
}