import { OrderItem  } from "./OrderItem";

export enum OrderStatus {
    CREATED = "created", 
    PROCESSING = "processing", 
    READY = "ready", 
    PICKED_UP = "pickedUp", 
    DELIVERED = "delivered"
} 

export interface Order {
    storeId: number
    items : Array<OrderItem>
    totalPrice: number
    status?: OrderStatus
}