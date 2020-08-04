import { CreateItemRequest } from '../requests/CreateCartRequest';
import { UpdateItemRequest } from '../requests/UpdateItemRequest';
import { Item } from '../models/Item';
import { ItemTbl } from '../dataLayer/ItemTbl';
import { SeqTbl } from '../dataLayer/SeqTbl';
import { ENT_ITEM} from '../utils/constants'
import { createLogger } from '../utils/logger';

const logger = createLogger("CartBl");
// Can not delete Item once created, only deactivation allowed.

export async function createItem(itemReq: CreateItemRequest): Promise<Item> {
    logger.debug("createItem - in");

    const ItemNum: number = await new SeqTbl().getNextSeqForEntity(ENT_ITEM);

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

    const item: Item = await new ItemTbl().createItem(itm);
    logger.debug("updateItem - out");
    return item;
}