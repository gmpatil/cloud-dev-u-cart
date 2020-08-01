import { CreateStoreRequest } from '../requests/CreateStoreRequest';
import { Store } from '../models/Store';
import { StoreTbl } from '../dataLayer/StoreTbl';
import { SeqTbl } from '../dataLayer/SeqTbl';
import { ENT_STORE } from '../utils/constants'
import { createLogger } from '../utils/logger';

const logger = createLogger("storeBl");

export async function createStore(storeReq: CreateStoreRequest): Promise<Store> {
    logger.debug("storeBlcreateStore - in");

    const storeNum: number = await new SeqTbl().getNextSeqForEntity(ENT_STORE);

    const store: Store = {
        storeNum: storeNum,
        name: storeReq.name,
        desc: storeReq.desc,
        createdAt: new Date().toISOString()
    }

    const item: Store = await new StoreTbl().createStore(store);
    logger.debug("storeBlcreateTodoItem - out");
    return item;
}

export async function updateStore(storeReq: CreateStoreRequest): Promise<Store> {
    logger.debug("storeBlupdateStore - in");

    const store: Store = {
        storeNum: storeReq.storeNum,
        name: storeReq.name,
        desc: storeReq.desc,
        createdAt: new Date().toISOString()
    }

    const item: Store = await new StoreTbl().createStore(store);
    logger.debug("storeBlupdateStore - out");
    return item;
}