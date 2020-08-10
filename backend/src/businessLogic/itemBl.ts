import { CreateItemRequest } from '../requests/CreateItemRequest';
import { UpdateItemRequest } from '../requests/UpdateItemRequest';
import { Item } from '../models/Item';
import { ItemTbl } from '../dataLayer/ItemTbl';
import { SeqTbl } from '../dataLayer/SeqTbl';
import { createLogger } from '../utils/logger';

const logger = createLogger("ItemBl");
// Can not delete Item once created, only deactivation allowed.

export async function createItem(itemReq: CreateItemRequest): Promise<Item> {
    logger.debug("createItem - in");

    const ItemNum: number = await new SeqTbl().getNextSeqForStoreItem(itemReq.storeNum);

    const itm: Item = {
        storeNum: itemReq.storeNum,
        itemNum: ItemNum,
        name: itemReq.name,
        desc: itemReq.desc,
        unitType: itemReq.unitType, 
        minIncrement: itemReq.minIncrement, 
        price: itemReq.price, 
        active: itemReq.active,
        createdAt: new Date().toISOString(),        
    }

    const item: Item = await new ItemTbl().createItem(itm);
    logger.debug("createItem - out");
    return item;
}

export async function updateItem(itemReq: UpdateItemRequest): Promise<Item> {
    logger.debug("updateItem - in");

    const itm: Item = {
        storeNum: itemReq.storeNum,
        itemNum: itemReq.itemNum,
        name: itemReq.name,
        desc: itemReq.desc,
        unitType: itemReq.unitType, 
        minIncrement: itemReq.minIncrement, 
        price: itemReq.price, 
        active: itemReq.active,
        createdAt: new Date().toISOString(),        
    }

    const item: Item = await new ItemTbl().updateItem(itm);
    logger.debug("updateItem - out");
    return item;
}

export async function getItem(storeNum: number, itemNum: number): Promise<Item> {
    logger.debug("updateItem - in");
    var item1: Item = await new ItemTbl().getItem(storeNum, itemNum);

    if (item1 == null) {
        item1 = null;
    }

    logger.debug("updateItem - out");
    return item1;
}

export async function getItemById(itemId: string): Promise<Item> {
    logger.debug("updateItem - in");
    var item1: Item = await new ItemTbl().getItemById(itemId);

    if (item1 == null) {
        item1 = null;
    }

    logger.debug("updateItem - out");
    return item1;
}


export async function getSignedUrl(userId: string, todoId: string)
    :Promise<string> {
    logger.debug("ucartBl.getSignedUrl - in");
    logger.debug("NOT Implemented");    
    // const todoItm: TodoItem = await ddb.getTodo(userId, todoId);
    
    // //record/overwrite as a new attachment URL or update to existing one.    
    // if (todoItm) {
    //     const downloadUrl :string = await s3Svc.getAttachementDownloadUrl(userId, todoId); 
    //     // Add/update attachementURL for Todo item in DB
    //     await ddb.updateTodoAttachement(userId, todoId, downloadUrl);

    //     // get signed/upload URL from S3
    //     const uploadUrl :string = await s3Svc.getAttachementUploadUrl(userId, todoId);        
    //     logger.debug("ucartBl.getSignedUrl - out 1");        
    //     return uploadUrl;
    // } else {
    //     logger.debug("ucartBl.getSignedUrl - out 2");        
    //     return null;
    // }

    return null;
}