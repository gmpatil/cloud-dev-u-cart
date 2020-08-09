import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants'

export class SeqTbl {
    constructor( private readonly dbClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("seqTbl") ) {}

    // All entity except StoreItem, StoreOrder
    // For Entities like StoreNum, and UseNum
    async getNextSeqForEntity(entityName: string): Promise<number> {
        this.logger.debug("seqTbl.getNextSeqForEntity - in");
        const upd = await this.dbClient.update({
            TableName: c.SEQ_TBL,
            Key: { entity: entityName},
            UpdateExpression: "set seq = if_not_exists(seq, 0) + 1",
            ReturnValues: "UPDATED_NEW"
        }).promise();
    
        this.logger.debug("seqTbl.getNextSeqForEntity - out");
        return upd.seq;
    } 
    
    //s-00001-item
    async getNextSeqForStoreItem(storeNum: number): Promise<number> {
        return this.getNextSeqForEntity( `s-${String(storeNum).padStart(5)}-item`);
    }    

    //s-00001-order
    async getNextSeqForStoreOrder(storeNum: number): Promise<number> {
        return this.getNextSeqForEntity( `s-${String(storeNum).padStart(5)}-order`);
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
  

