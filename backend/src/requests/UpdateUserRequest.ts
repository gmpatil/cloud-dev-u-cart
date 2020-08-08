import { Address } from '../models/User'
/**
 * Fields in a request to update a single User.
 */

export interface UpdateUserRequest {
    userNum?: number
    userId: string
    name?: string
    contactPhone?: string
    address?: Address
}