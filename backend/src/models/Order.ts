import { OrderItem  } from "./OrderItem";

export enum OrderStatus {
    CREATED = "created", 
    PROCESSING = "processing", 
    READY = "ready", 
    PICKED_UP = "pickedUp", 
    DELIVERED = "delivered"
} 

export interface Order {
    orderId?: string //storeNum(5)-ordernum(10)
    userId: string
    storeNum: number
    orderNum: number
    items : Array<OrderItem>
    totalPrice: number
    status?: OrderStatus
}