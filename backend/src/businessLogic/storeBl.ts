import { CreateStoreRequest } from '../requests/CreateStoreRequest';
import { Store } from '../models/Store';
import { StoreTbl } from '../dataLayer/StoreTbl';
import { SeqTbl } from '../dataLayer/SeqTbl';
import { ENT_STORE } from '../utils/constants'
import { createLogger } from '../utils/logger';

const logger = createLogger("storeBl");

export async function createStore(storeReq: CreateStoreRequest): Promise<Store> {
    logger.debug("storeBl.createStore - in");

    const storeNum: number = await new SeqTbl().getNextSeqForEntity(ENT_STORE);

    const store: Store = {
        storeNum: storeNum,
        name: storeReq.name,
        desc: storeReq.desc,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
    }

    const item: Store = await new StoreTbl().createStore(store);
    logger.debug("storeBl.createStore - out");
    return item;
}

export async function updateStore(storeReq: CreateStoreRequest): Promise<Store> {
    logger.debug("updateStore - in");

    const store: Store = {
        storeNum: storeReq.storeNum,
        name: storeReq.name,
        desc: storeReq.desc,
        lastUpdatedAt: new Date().toISOString()
    }

    const item: Store = await new StoreTbl().updateStore(store);
    logger.debug("updateStore - out");
    return item;
}

export async function getStore(storeNum: number): Promise<Store> {
    logger.debug("getStore - in");
    var store: Store = await new StoreTbl().getStore(storeNum);

    if (store == null) {
        store = null;
    }

    logger.debug("getStore - out");
    return store;
}

export async function getStores(): Promise<Array<Store>> {
    logger.debug("getStore - in");
    var stores: Array<Store> = await new StoreTbl().getStores();

    if (stores == null) {
        stores = null;
    }

    logger.debug("getStore - out");
    return stores;
}