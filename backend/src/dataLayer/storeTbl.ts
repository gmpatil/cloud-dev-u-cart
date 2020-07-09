import * as AWS from 'aws-sdk';
import { Store } from '../models/Store';
import { TBL_STORE, LOCAL_DYNAMODB_EP } from '../utils/constants';
import { createLogger } from '../utils/logger';

const logger = createLogger("todoDb");

let dbDocClient: AWS.DynamoDB.DocumentClient;

if (process.env.IS_OFFLINE) {
    dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: LOCAL_DYNAMODB_EP });
} else {
    dbDocClient = new AWS.DynamoDB.DocumentClient();
}

export async function createStore(store: Store): Promise<Store> {
    logger.debug("storeTbl.createStore - in");

    await dbDocClient.put({
        TableName: TBL_STORE,
        Item: store,
        ConditionExpression: 'attribute_not_exists(storeNum)'
    }).promise();

    logger.debug("storeTbl.createStore - out");
    return store;
}

export async function updateStore(store: Store): Promise<Store> {
    logger.debug("storeTbl.updateStore - in");

    await dbDocClient.put({
        TableName: TBL_STORE,
        Item: store
    }).promise();

    logger.debug("storeTbl.updateStore - out");
    return store;
}

export async function getStore(storeNum: number): Promise<Store> {
    logger.debug("storeTbl.getStore - in");

    const result = await dbDocClient.get({
        TableName: TBL_STORE,
        Key: {
            storeNum: storeNum
        }
    }).promise();

    logger.debug("storeTbl.getStore - out");
    return result.Item as Store;
}

// Once created, can not be deleted.
// export async function deleteStore(storeNum: number): Promise<void> {
//     logger.debug("storeTbl.deleteStore - in");

//     await dbDocClient.delete({ TableName: TBL_STORE, Key: { storeNum: storeNum } }).promise();

//     logger.debug("storeTbl.deleteStore - out");
// }