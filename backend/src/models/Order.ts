import { OrderItem  } from "./OrderItem";

export enum OrderStatus {
    CREATED = "CREATED", 
    PROCESSING = "PROCESSING", 
    READY = "READY", 
    PICKED_UP = "PICKED_UP", 
    DELIVERED = "DELIVERED"
} 

export interface Order {
    userId: string    
    orderId?: string //storeNum(5)-ordernum(10)
    storeNum: number
    orderNum: number
    items : Array<OrderItem>
    totalPrice: number
    status?: OrderStatus
    createdAt?: string
    lastUpdatedAt?: string
    gsi1pk?: string
    gsi1sk?: string    
    gsi2pk?: string
    gsi2sk?: string
}