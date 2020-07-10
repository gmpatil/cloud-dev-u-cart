import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {Cart} from '../models/Cart'

export class CartTbl {
    constructor( private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("cartTbl") ) {}

    async upsertCart(cart :Cart): Promise<Cart> {
        this.logger.debug("cartTbl.upsertCart - in");
    
        await this.dbDocClient.put({
            TableName: c.TBL_CART,
            Item: cart
        }).promise();
    
        this.logger.debug("cartTbl.upsertCart - out");
        return cart;
    }

    async getCart(userId: string, storeNum: number): Promise<Cart> {
        this.logger.debug("cartTbl.getCart - in");
    
        const result = await this.dbDocClient.get({
            TableName: c.TBL_CART,
            Key: {
                userId: userId,
                storeNum: storeNum
            }
        }).promise();
    
        this.logger.debug("cartTbl.getCart - out");
        return result.Item as Cart;
    }
    
    
    async deleteCart(userId: string, storeNum: number): Promise<void> {
        this.logger.debug("cartTbl.deleteCart - in");
    
        await this.dbDocClient.delete({ TableName: c.TBL_CART, Key: { userId: userId, storeNum: storeNum } }).promise();
    
        this.logger.debug("cartTbl.deleteCart - out");
    }
        
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
  