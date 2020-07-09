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
    storeNum: number
    orderNum: number
    items : Array<OrderItem>
    totalPrice: number
    status?: OrderStatus
}