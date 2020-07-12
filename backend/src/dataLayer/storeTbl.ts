import * as AWS from 'aws-sdk';
import { Store } from '../models/Store';
import { TBL_STORE, LOCAL_DYNAMODB_EP } from '../utils/constants';
import { createLogger } from '../utils/logger';

export class StoreTbl {
    constructor(private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("storeTbl")) { }


    async createStore(store: Store): Promise<Store> {
        this.logger.debug("storeTbl.createStore - in");

        await this.dbDocClient.put({
            TableName: TBL_STORE,
            Item: store,
            ConditionExpression: 'attribute_not_exists(storeNum)'
        }).promise();

        this.logger.debug("storeTbl.createStore - out");
        return store;
    }

    async updateStore(store: Store): Promise<Store> {
        this.logger.debug("storeTbl.updateStore - in");

        await this.dbDocClient.put({
            TableName: TBL_STORE,
            Item: store
        }).promise();

        this.logger.debug("storeTbl.updateStore - out");
        return store;
    }

    async getStore(storeNum: number): Promise<Store> {
        this.logger.debug("storeTbl.getStore - in");

        const result = await this.dbDocClient.get({
            TableName: TBL_STORE,
            Key: {
                storeNum: storeNum
            }
        }).promise();

        this.logger.debug("storeTbl.getStore - out");
        return result.Item as Store;
    }

    // Once created, can not be deleted.
    // async deleteStore(storeNum: number): Promise<void> {
    //     this.logger.debug("storeTbl.deleteStore - in");

    //     await this.dbDocClient.delete({ TableName: TBL_STORE, Key: { storeNum: storeNum } }).promise();

    //     this.logger.debug("storeTbl.deleteStore - out");
    // }

}

function createDynamoDBClient() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    let dbDocClient: AWS.DynamoDB.DocumentClient;
    if (process.env.IS_OFFLINE) {
        return dbDocClient = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: LOCAL_DYNAMODB_EP
        });
    } else {
        return dbDocClient = new AWS.DynamoDB.DocumentClient();
    }
}
