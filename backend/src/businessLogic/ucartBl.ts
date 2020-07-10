import { CreateStoreRequest } from '../requests/CreateStoreRequest';
import { Store } from '../models/Store';

import { CreateTodoRequest } from '../requests/CreateItemRequest';
import { UpdateTodoRequest } from '../requests/UpdateItemRequest';
import * as uuid from 'uuid';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/Item';
import * as ddb from '../dataLayer/CartTbl';
import * as s3Svc from '../dataLayer/ImageS3';
import { TodoUpdate } from '../models/ItemUpdate';


const logger = createLogger("ucartBl");

export async function createStore(storeReq: CreateStoreRequest): Promise<Store> {
    logger.debug("ucartBl.createStore - in");

    const todoId = uuid.v4();
    const todoDb: TodoItem = {
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: todoBus.name,
        done: false,
        ...todoBus
    }

    const item: TodoItem = await ddb.createTodo(todoDb);
    logger.debug("ucartBl.createTodoItem - out");
    return item;
}

export async function getItemsForStore(userId: string): Promise<TodoItem[]> {
    logger.debug("ucartBl.getTodosForUser - in");
    const items: TodoItem[] = await ddb.getTodoByUser(userId);
    logger.debug("ucartBl.getTodosForUser - out");
    return items;
}

export async function createTodoItem(userId: string, todoBus: CreateTodoRequest): Promise<TodoItem> {
    logger.debug("ucartBl.createTodoItem - in");

    const todoId = uuid.v4();
    const todoDb: TodoItem = {
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: todoBus.name,
        done: false,
        ...todoBus
    }

    const item: TodoItem = await ddb.createTodo(todoDb);
    logger.debug("ucartBl.createTodoItem - out");
    return item;
}

export async function updateTodoItem(userId: string, todoId: string, todoBus: UpdateTodoRequest)
    : Promise<TodoUpdate> {
    logger.debug("ucartBl.updateTodoItem - in");
    const updItem: TodoUpdate = await ddb.updateCart(userId, todoId, todoBus);
    logger.debug("ucartBl.updateTodoItem - out");
    return updItem;
}

export async function deleteTodoItem(userId: string, todoId: string)
    : Promise<void> {
    logger.debug("ucartBl.deleteTodoItem - in");

    const todoItm: TodoItem = await ddb.getTodo(userId, todoId);
    if (todoItm) {
        // Delete attachement from S3 bucket
        if (todoItm.attachmentUrl) {
            await s3Svc.deleteAttachement(todoId);
        }

        // Delete TodoItem from DynamoDB
        await ddb.deleteCart(userId, todoId);        
    }

    logger.debug("ucartBl.deleteTodoItem - out");
    return;
}

export async function getSignedUrl(userId: string, todoId: string)
    :Promise<string> {
    logger.debug("ucartBl.getSignedUrl - in");
    const todoItm: TodoItem = await ddb.getTodo(userId, todoId);
    
    //record/overwrite as a new attachment URL or update to existing one.    
    if (todoItm) {
        const downloadUrl :string = await s3Svc.getAttachementDownloadUrl(userId, todoId); 
        // Add/update attachementURL for Todo item in DB
        await ddb.updateTodoAttachement(userId, todoId, downloadUrl);

        // get signed/upload URL from S3
        const uploadUrl :string = await s3Svc.getAttachementUploadUrl(userId, todoId);        
        logger.debug("ucartBl.getSignedUrl - out 1");        
        return uploadUrl;
    } else {
        logger.debug("ucartBl.getSignedUrl - out 2");        
        return null;
    }
}