import { OrderItem  } from "./OrderItem";

export enum OrderStatus {
    CREATED = "created", 
    PROCESSING = "processing", 
    READY = "ready", 
    PICKED_UP = "pickedUp", 
    DELIVERED = "delivered"
} 

export interface Order {
    userId: string    
    orderId?: string //storeNum(5)-ordernum(10)
    storeNum: number
    orderNum: number
    items : Array<OrderItem>
    totalPrice: number
    status?: OrderStatus
    lastUpdatedAt?: string
}