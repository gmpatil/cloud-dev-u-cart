import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {Item} from '../models/Item'

export class ItemTbl {
    constructor( private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("itemTble") ) {}

    async createItem(item :Item): Promise<Item> {
        this.logger.debug("itemTble.createItem - in");
    
        await this.dbDocClient.put({
            TableName: c.TBL_ITEM,
            Item: item
        }).promise();
    
        this.logger.debug("itemTble.createItem - out");
        return item;
    }
    
    // update everything
    async updateItem(item :Item): Promise<Item> {
        this.logger.debug("itemTble.updateItem - in");
    
        await this.dbDocClient.put({
            TableName: c.TBL_ITEM,
            Item: item
        }).promise();
    
        this.logger.debug("itemTble.updateItem - out");
        return item;
    }
    
    async getItem(storeNum: number, itemNum: number): Promise<Item> {
        this.logger.debug("itemTble.getItem - in");
    
        const result = await this.dbDocClient.get({
            TableName: c.TBL_ITEM,
            Key: {
                storeNum: storeNum,
                itemNum: itemNum            
            }
        }).promise();
    
        this.logger.debug("itemTble.getItem - out");
        return result.Item as Item;
    }    
    
    async deleteItem(storeNum: number, itemNum: number): Promise<void> {
        this.logger.debug("itemTble.deleteItem - in");
    
        await this.dbDocClient.delete({ TableName: c.TBL_ITEM, Key: { storeNum: storeNum, itemNum: itemNum } }).promise();
    
        this.logger.debug("itemTble.deleteItem - out");
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