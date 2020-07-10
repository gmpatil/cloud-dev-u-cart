import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants'

export class SeqTbl {
    constructor( private readonly dbClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("seqTbl") ) {}

    async getNextSeqForEntity(entityName: string): Promise<number> {
        this.logger.debug("seqTbl.getNextSeqForEntity - in");
        const upd = await this.dbClient.update({
            TableName: c.TBL_SEQ,
            Key: { entity: entityName},
            UpdateExpression: "set seq = seq + 1",
            ReturnValues: "UPDATED_NEW"
        }).promise();
    
        this.logger.debug("seqTbl.getNextSeqForEntity - out");
        return upd.seq;
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
  

