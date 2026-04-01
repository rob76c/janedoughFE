import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { OrdersStore } from '../../data-access/order.store';
import { OrdersTable } from "./orders-table/orders-table";

@Component({
  selector: 'webapp-my-orders',
  imports: [BackButton, OrdersTable],
  providers: [OrdersStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-[1200px] py-6 px-4">
      <app-back-button class="mb-6" navigateTo="/products/all">Continue Shopping</app-back-button>
      <h1 class="text-2xl font-bold mb-6">My Orders</h1>
      @if (store.loading()) {
        <div class="text-center py-8">Loading orders...</div>
      }

      @if (store.orders(); as orders) {
        @if (orders.length === 0) {
          <div class="text-center py-8 text-gray-500">No orders found</div>
        } @else {
          <webapp-orders-table [orders]="store.orders()" />
        }
      }


    </div>
  `,
  styles: ``,
})
export default class MyOrders {
store = inject(OrdersStore);
}
