import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { Order } from "../model/order";
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { OrderService } from "./order.service";


export type OrdersState = {
    orders: Order[];
    loading: boolean;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
}

const initialState: OrdersState={
    orders: [],
    loading: false,
    totalElements: 0,
    pageNumber: 0,
    pageSize: 10,
};

export const OrdersStore = signalStore(

    withState(initialState),

    withMethods((store, orderService = inject(OrderService)) => {

        const loadOrders= async (pageNumber = store.pageNumber(), pageSize = store.pageSize()) => {
            patchState(store, { loading: true });
            try {
                const response = await firstValueFrom(orderService.getAllUserOrders(pageNumber,pageSize));
                patchState(store, { 
                    orders: response.content, 
                    totalElements: response.totalElements,
                    pageNumber: response.pageNumber,
                    pageSize: response.pageSize,
                    loading: false });
            } catch (error) {
                console.error('Failed to load orders', error);
                patchState(store, { loading: false });
            }
        };
        return {
            loadOrders,
            changePage: (event: { pageIndex: number; pageSize: number }) => {
                patchState(store, { pageNumber: event.pageIndex, pageSize: event.pageSize });
                loadOrders(event.pageIndex, event.pageSize);
            }
        }
    }),

    withHooks({
        onInit(store) {
            // Automatically fetch orders when the store is initialized
            store.loadOrders();
        }
    })
    
);