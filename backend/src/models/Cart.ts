import { OrderItem  } from "./OrderItem";

export interface Cart {
    storeId: number
    items : Array<OrderItem>
    totalPrice: number
}