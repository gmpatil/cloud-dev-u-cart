import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {Cart} from '../models/Cart'

/*
Cart table.
PK UserNum
SortKey StoreNum
*/
// KeySchema:
// - AttributeName: userNum  // TODO: use UserId for better hash dist.
//   KeyType: HASH
// - AttributeName: storeNum
//   KeyType: RANGE

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

    async getCart(userNum: number, storeNum: number): Promise<Cart> {
        this.logger.debug("cartTbl.getCart - in");
    
        const result = await this.dbDocClient.get({
            TableName: c.TBL_CART,
            Key: {
                userId: userNum,
                storeNum: storeNum
            }
        }).promise();
    
        this.logger.debug("cartTbl.getCart - out");
        return result.Item as Cart;
    }
    
    
    async deleteCart(userNum: number, storeNum: number): Promise<void> {
        this.logger.debug("cartTbl.deleteCart - in");
    
        await this.dbDocClient.delete({ TableName: c.TBL_CART, Key: { userNum: userNum, storeNum: storeNum } }).promise();
    
        this.logger.debug("cartTbl.deleteCart - out");
    }
        
}

function createDynamoDBClient() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    //let dbDocClient: AWS.DynamoDB.DocumentClient;
    if (process.env.IS_OFFLINE) {
        return  new AWS.DynamoDB.DocumentClient({ 
            region: 'localhost', 
            endpoint: c.LOCAL_DYNAMODB_EP
        });
    } else {
        return new AWS.DynamoDB.DocumentClient();
    }
}
  