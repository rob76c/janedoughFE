import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { OrdersStore } from '../../data-access/order.store';
import { OrdersTable } from "./orders-table/orders-table";
import { MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'webapp-my-orders',
  imports: [BackButton, OrdersTable, MatPaginatorModule],
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
        @if (orders.length === 0 && !store.loading()) {
          <div class="text-center py-8 text-gray-500">No orders found</div>
        } @else if ((orders.length > 0)){
          <webapp-orders-table [orders]="orders" />

          <mat-paginator 
            [length]="store.totalElements()"
            [pageSize]="store.pageSize()"
            [pageIndex]="store.pageNumber()"
            [pageSizeOptions]="[5, 10, 25]"
            (page)="store.changePage($event)"
            aria-label="Select page">
          </mat-paginator>
        }
      }
    </div>
  `,
  styles: ``,
})
export default class MyOrders {
store = inject(OrdersStore);
}
