import * as AWS from 'aws-sdk';
import { Store } from '../models/Store';
import { STORE_TBL, LOCAL_DYNAMODB_EP } from '../utils/constants';
import { createLogger } from '../utils/logger';

// KeySchema:
// - AttributeName: storeNum  //TODO make key better hash distributed or move table to RDBMS
//   KeyType: HASH


export class StoreTbl {
    constructor(private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("storeTbl")) { }


    async createStore(store: Store): Promise<Store> {
        this.logger.debug("storeTbl.createStore - in");

        await this.dbDocClient.put({
            TableName: STORE_TBL,
            Item: store,
            ConditionExpression: 'attribute_not_exists(storeNum)'
        }).promise();

        this.logger.debug("storeTbl.createStore - out");
        return store;
    }

    async updateStore(store: Store): Promise<Store> {
        this.logger.debug("storeTbl.updateStore - in");

        await this.dbDocClient.put({
            TableName: STORE_TBL,
            Item: store
        }).promise();

        this.logger.debug("storeTbl.updateStore - out");
        return store;
    }

    async getStore(storeNum: number): Promise<Store> {
        this.logger.debug("storeTbl.getStore - in");

        const result = await this.dbDocClient.get({
            TableName: STORE_TBL,
            Key: {
                storeNum: storeNum
            }
        }).promise();

        this.logger.debug("storeTbl.getStore - out");
        return result.Item as Store;
    }

    async getStores(): Promise<Array<Store>> {
        this.logger.debug("storeTbl.getStore - in");

        const result = await this.dbDocClient.scan({
            TableName: STORE_TBL
        }).promise();

        this.logger.debug("storeTbl.getStore - out");
        return result.Items as Array<Store>;
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
