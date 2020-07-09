import { OrderItem  } from "./OrderItem";

export interface Cart {
    userId: string
    storeNum: number
    items : Array<OrderItem>
    totalPrice: number
}