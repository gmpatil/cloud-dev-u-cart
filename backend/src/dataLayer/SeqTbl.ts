import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants'

export class SeqTbl {
    constructor(private readonly dbClient: AWS.DynamoDB = createDynamoDB(),
        private readonly logger = createLogger("seqTbl")) { }

    // All entity except StoreItem, StoreOrder
    // For Entities like StoreNum, and UseNum
    async getNextSeqForEntity(entityName: string): Promise<number> {
        this.logger.debug(`seqTbl.getNextSeqForEntity - in - ${c.SEQ_TBL}  entity: ${entityName}`);
        //const upd:AWS.DynamoDB.DocumentClient.UpdateItemOutput = 
        //const upd =  
        const upd: AWS.DynamoDB.UpdateItemOutput = await this.dbClient.updateItem({
            TableName: "sequence-test",
            Key: { "entity": { "S": "user" } },
            ExpressionAttributeValues: {
                ":incr": { "N": "1"},
                ":init": { "N": "0" }
            },
            UpdateExpression: "SET seq = if_not_exists(seq, :init) + :incr",
            ReturnValues: "UPDATED_NEW"            
        }).promise();

        this.logger.debug(`seqTbl.getNextSeqForEntity - out  ${JSON.stringify({"Attributes": upd.Attributes})} `); 
        return Promise.resolve(Number(upd.Attributes.seq.N));
    }

    //s-00001-item
    async getNextSeqForStoreItem(storeNum: number): Promise<number> {
        return this.getNextSeqForEntity(`s-${String(storeNum).padStart(5)}-item`);
    }

    //s-00001-order
    async getNextSeqForStoreOrder(storeNum: number): Promise<number> {
        return this.getNextSeqForEntity(`s-${String(storeNum).padStart(5)}-order`);
    }
}

// function createDynamoDBClient() {
//     // const AWSXRay = require('aws-xray-sdk');
//     // const AWS = AWSXRay.captureAWS(AWSb)

//     let dbDocClient: AWS.DynamoDB.DocumentClient = null;
//     if (process.env.IS_OFFLINE) {
//         dbDocClient = new AWS.DynamoDB.DocumentClient({
//             region: 'localhost',
//             endpoint: c.LOCAL_DYNAMODB_EP
//         });
//     } else {
//         dbDocClient = new AWS.DynamoDB.DocumentClient();
//     }

//     return dbDocClient;
// }

function createDynamoDB(): AWS.DynamoDB {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    let dbClient: AWS.DynamoDB = null;
    if (process.env.IS_OFFLINE) {
        dbClient = new AWS.DynamoDB({
            region: 'localhost',
            endpoint: c.LOCAL_DYNAMODB_EP
        });
    } else {
        dbClient = new AWS.DynamoDB();
    }

    return dbClient;
}

