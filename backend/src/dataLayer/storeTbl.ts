import * as AWS from 'aws-sdk';
import { Store } from '../models/Store';
import { TBL_STORE, LOCAL_DYNAMODB_EP } from '../utils/constants';
import { createLogger } from '../utils/logger';

const logger = createLogger("todoDb");

let dbDocClient: AWS.DynamoDB.DocumentClient;
let dbClient: AWS.DynamoDB;

if (process.env.IS_OFFLINE) {
    dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: LOCAL_DYNAMODB_EP });
    dbClient = new AWS.DynamoDB({ endpoint: LOCAL_DYNAMODB_EP });
} else {
    dbDocClient = new AWS.DynamoDB.DocumentClient();
    dbClient = new AWS.DynamoDB();
}

export async function createStore(store: Store): Promise<Store> {
    logger.debug("createStoreTbl.createStore - in");

    await dbDocClient.put({
        TableName: TBL_STORE,
        Item: store,
        ConditionExpression: 'attribute_not_exists(id)'
    }).promise();

    logger.debug("createStoreTbl.createStore - out");
    return store;
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem> {
    logger.debug("createStoreTbl.getTodo - in");

    const result = await dbDocClient.get({
        TableName: tbl,
        Key: {
            userId: userId,
            todoId: todoId
        }
    }).promise();

    logger.debug("createStoreTbl.getTodo - out");
    return result.Item as TodoItem;
}

export async function getTodoByUser(userId: string): Promise<TodoItem[]> {
    logger.debug("createStoreTbl.getTodoByUser - in");

    const result = await dbDocClient.query({
        TableName: tbl,
        IndexName: idx,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
    }).promise();

    logger.debug("createStoreTbl.getTodoByUser - out");
    return result.Items as TodoItem[];
}

export async function updateTodo(userId: string, todoId: string, upd: TodoUpdate): Promise<TodoUpdate> {
    logger.debug("createStoreTbl.updateTodo - in");

    // Name is reserved word in DynamoDB.
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
    await dbDocClient.update({
        TableName: tbl,
        Key: { userId: userId, todoId: todoId },
        UpdateExpression: "set #name=:nm, dueDate=:dd, done=:dn",
        ExpressionAttributeValues: {
            ":nm": upd.name,
            ":dd": upd.dueDate,
            ":dn": upd.done
        },
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();

    logger.debug("createStoreTbl.updateTodo - out");
    return upd;
}

export async function updateTodoAttachement(userId: string, todoId: string, downloadUrl: string)
    :Promise<void> {
        
    logger.debug("createStoreTbl.updateTodoAttachement - in");
    await dbDocClient.update({
        TableName: tbl,
        Key: { userId: userId, todoId: todoId },
        UpdateExpression: "set attachmentUrl=:aur",
        ExpressionAttributeValues: {
            ":aur": downloadUrl
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();

    logger.debug("createStoreTbl.updateTodoAttachement - out");
    return ;
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    logger.debug("createStoreTbl.deleteTodo - in");

    await dbDocClient.delete({ TableName: tbl, Key: { userId, todoId } }).promise();

    logger.debug("createStoreTbl.deleteTodo - out");
}