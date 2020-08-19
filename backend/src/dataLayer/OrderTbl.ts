import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import { ORDER_TBL, ORDER_GSI1, ORDER_GSI2, LOCAL_DYNAMODB_EP} from '../utils/constants';
import { Order, OrderStatus } from '../models/Order'

/*
OrderTbl:
Pk: orderId - `${String(storeNum).padStart(5, '0')}-${String(orderNum).padStart(10, '0')}`

GSI1PK: `${uid}#${status}`  GSI1SK: `orderId`

GSI2PK: `${String(storeNum).padStart(5, '0')}#${status}`  GSI2SK: `${String(orderNum).padStart(10, '0')}#`
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
        return `${String(storeNum).padStart(5, '0')}-${String(orderNum).padStart(10, '0')}`;
    }

    getGSI1PK (uid: string, status: string):string {
        // storeNum#status 
        // TODO artificially increase partions by suffix random number/letter
        // 0-4/A-E. While querying query all 0-4 suffixes and aggregate the results.
        return `${uid}#${status}`;
    }

    getGSI1SK (storeNum: number, orderNum: number):string {
        // orderId
        return this.getOrderId(storeNum, orderNum);
    }

    getGSI2PK (storeNum: number, status: string):string {
        // storeNum#status 
        // TODO artificially increase partions by suffix random number/letter
        // 0-4/A-E. While querying query all 0-4 suffixes and aggregate the results.
        return `${String(storeNum).padStart(5, '0')}#${status}`;
    }

    getGSI2SK (orderNum: number):string {
        // orderNum#
        return `${String(orderNum).padStart(10, '0')}#`;
    }

    async createOrder(order: Order): Promise<Order> {
        this.logger.debug("orderTbl.createOrder - in");

        order.orderId = this.getOrderId(order.storeNum, order.orderNum);
        if (order.status == null) {
            order.status = OrderStatus.CREATED;
        }

        order.createdAt = new Date().toISOString() ;
        order.lastUpdatedAt = new Date().toISOString();

        order.gsi1pk = this.getGSI1PK(order.userId, order.status.toString());
        order.gsi1sk = this.getGSI1SK(order.storeNum, order.orderNum);

        order.gsi2pk = this.getGSI2PK(order.storeNum, order.status.toString());
        order.gsi2sk = this.getGSI2SK(order.orderNum);

        await this.dbDocClient.put({
            TableName: ORDER_TBL,
            Item: order,
            ConditionExpression: "attribute_not_exists(orderNum)"
        }).promise();

        this.logger.debug("orderTbl.createOrder - out");
        return order;
    }

    // Updates only status
    async updateOrder(orderId: string, status: string): Promise<Order> {
        this.logger.debug("orderTbl.updateOrder - in");


        const lastUpdatedAt = new Date().toISOString();

        const ret = await this.dbDocClient.update({
            TableName: ORDER_TBL,
            Key: { orderId: orderId},
            UpdateExpression: "set #status = :val1, lastUpdatedAt = :lu",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":val1": status,
                ":lu": lastUpdatedAt
            },
            ReturnValues: "ALL_NEW"
        }).promise();

        this.logger.debug("orderTbl.updateOrder - out");
        return ret.Attributes as Order;
    }

    async getOrder(storeNum: number, orderNum: number): Promise<Order> {
        this.logger.debug(`orderTbl.getOrder - in `);
        const orderId = this.getOrderId(storeNum, orderNum);
        this.logger.debug(`orderTbl.getOrder - orderId ${orderId}`);

        const result = await this.dbDocClient.get({
            TableName: ORDER_TBL,
            Key: {
                orderId: orderId
            }
        }).promise();

        this.logger.debug("orderTbl.getOrder - out");
        return result.Item as Order;
    }

    async getOrderById(orderId: string): Promise<Order> {
       this.logger.debug("orderTbl.getOrderById - in");

       this.logger.debug(`orderTbl.getOrderById - orderId ${orderId}`);

       const result = await this.dbDocClient.get({
            TableName: ORDER_TBL,
            Key: {
                orderId: orderId
            }
        }).promise();

        this.logger.debug("orderTbl.getOrderById - out");
        return result.Item as Order;
    }

    async getOrdersByUserId(uid: string, sts: OrderStatus): Promise<Array<Order>> {
        this.logger.debug("getOrderByUserId - in");
 
        const pk : string = this.getGSI1PK(uid, sts);

        this.logger.debug(`getOrdersByUserId - GSI1PK ${pk}`); 
               
        const result = await this.dbDocClient.query({
             TableName: ORDER_TBL,
             IndexName: ORDER_GSI1,
             KeyConditionExpression: "gsi1pk = :pk",            
             ExpressionAttributeValues: { 
                 ":pk": pk 
             }
        }).promise();
 
         this.logger.debug(`getOrderByUserId - out.  ${result.Items}`);
         return result.Items as Array<Order>;
     }    

     async getOrdersByStore(storeNum: number, sts: OrderStatus): Promise<Array<Order>> {
        this.logger.debug("getOrderByStore - in");
 
        const pk : string = this.getGSI2PK(storeNum, sts);

        const result = await this.dbDocClient.query({
             TableName: ORDER_TBL,
             IndexName: ORDER_GSI2,
             KeyConditionExpression: 'gsi2pk = :storeSts ',
             ExpressionAttributeValues: { 
                 ':storeSts': pk
             }
        }).promise();
 
         this.logger.debug("getOrderByStore - out");
         return result.Items as Array<Order>;
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

    let dbDocClient: AWS.DynamoDB.DocumentClient = null;
    if (process.env.IS_OFFLINE) {
        dbDocClient = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: LOCAL_DYNAMODB_EP
        });
    } else {
        dbDocClient = new AWS.DynamoDB.DocumentClient();
    }

    return dbDocClient;
}
  