import { UserProfile } from '../models/UserProfile';
import { UserAccessTbl } from '../dataLayer/UserAccessTbl';
import { createLogger } from '../utils/logger';

const logger = createLogger("userAccess.");

export async function createUserAccess(up: UserProfile): Promise<UserProfile> {
    logger.debug("createUserAccess - in");
 
    const item: UserProfile = await new UserAccessTbl().insertUserAccess(up);
    logger.debug("createUserAccess - out");
    return item;
}

