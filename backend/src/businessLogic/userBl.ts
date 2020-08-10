import { CreateUserRequest } from '../requests/CreateUserRequest';
import { UpdateUserRequest } from '../requests/UpdateUserRequest';
import { User } from '../models/User';
import { UserTbl } from '../dataLayer/UserTbl';
import { SeqTbl } from '../dataLayer/SeqTbl';
import { ENT_USER } from '../utils/constants'
import { createLogger } from '../utils/logger';

const logger = createLogger("userBl");

export async function createUser(userReq: CreateUserRequest): Promise<User> {
    logger.debug("userBl.createUser - in");

    const userNum: number = await new SeqTbl().getNextSeqForEntity(ENT_USER);

    const user: User = {
        userNum: userNum,
        userId: userReq.userId,
        name: userReq.name,
        address: userReq.address,
        contactPhone: userReq.contactPhone,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
    }

    const item: User = await new UserTbl().upsertUser(user);
    logger.debug("userBl.createUser - out");
    return item;
}

export async function updateUser(userReq: UpdateUserRequest): Promise<User> {
    logger.debug("suserBl.updateUser - in");

    const user: User = {
        userNum: userReq.userNum,
        userId: userReq.userId,
        name: userReq.name,
        address: userReq.address,        
        contactPhone: userReq.contactPhone,
        lastUpdatedAt: new Date().toISOString()
    }

    const item: User = await new UserTbl().upsertUser(user);
    logger.debug("userBl.updateUser - out");
    return item;
}

export async function getUser(userNum: number): Promise<User> {
    logger.debug("getUser - in");
    var user: User = await new UserTbl().getUser(userNum);

    if (user == null) {
        user = null;
    }

    logger.debug("getUser - out");
    return user;
}

export async function getUserId(userId: string): Promise<User> {
    logger.debug("getUserId - in");
    var user: User = await new UserTbl().getUserById(userId);
    if (user == null) { // null or undefined
        user = null;
    }
    logger.debug("getUserId - out");
    return user;
}