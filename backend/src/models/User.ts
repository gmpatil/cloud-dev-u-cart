
export interface Address {
    addressLine1: string
    addressLine2?: string
    city: string
    zip: string
    state: string
}

export interface User {
    userNum: number
    userId: string
    name?: string
    address?: Address
    storeAdmin?: boolean
    storeNum?: number
    contactPhone?: string
    createdAt?:string
    lastUpdatedAt?:string
}