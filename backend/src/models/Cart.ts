import { OrderItem  } from "./OrderItem";

export interface Cart {
    userNum: number
    storeNum: number
    items : Array<OrderItem>
    totalPrice: number
}