import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { Order } from "../model/order";
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OrderService } from "./order.service";


export type OrdersState = {
    orders: Order[];
    loading: boolean;
}

const initialState: OrdersState={
    orders: [],
    loading: false,
};

export const OrdersStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store, orderService = inject(OrderService)) => ({
        loadOrders: async () => {
            patchState(store, { loading: true });
            try {
                const response = await firstValueFrom(orderService.getAllUserOrders());
                console.log(response);
                const orders = response.content ;
                
                patchState(store, { orders, loading: false });
            } catch (error) {
                console.error('Failed to load orders', error);
                patchState(store, { loading: false });
            }
        }
    })),

    withHooks({
        onInit(store) {
            // Automatically fetch orders when the store is initialized
            store.loadOrders();
        }
    })
    
);