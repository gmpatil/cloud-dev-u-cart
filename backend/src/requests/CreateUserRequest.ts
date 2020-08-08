import { Address } from '../models/User'
/**
 * Fields in a request to create a single User.
 */
export interface CreateUserRequest {
    userNum?: number
    userId: string
    name?: string
    contactPhone?: string    
    address?: Address
}