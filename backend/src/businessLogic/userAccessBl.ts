import { UserProfile } from '../models/UserProfile';
import { UserAccessTbl } from '../dataLayer/UserAccessTbl';
import { createLogger } from '../utils/logger';

const logger = createLogger("userBl");

export async function createUserAccess(up: UserProfile): Promise<UserProfile> {
    logger.debug("userBl.createUserProfile - in");
 
    const item: UserProfile = await new UserAccessTbl().insertUserAccess(up);
    logger.debug("userBl.createUserProfile - out");
    return item;
}

