import { signalStore, withState } from "@ngrx/signals";
import { Order } from "../../checkout/model/order"

export type OrdersState = {
    orders: Order[];
}

const initialState: OrdersState={
    orders: [],
};

export const OrdersStore = signalStore(
    withState(initialState),
    
)