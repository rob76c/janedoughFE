import { Component, inject } from '@angular/core';
import { Order } from '../../../../model/order';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'webapp-order-details-dialog',
  imports: [MatDialogModule, CurrencyPipe, DatePipe, TitleCasePipe, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="!font-bold">Order Details</h2>
    <mat-dialog-content>
      <div class="flex flex-col gap-3 min-w-[350px] pt-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Order ID:</span>
          <span class="font-medium">{{ data.order.orderId }}</span>
        </div>
       
        <div class="flex justify-between">
          <span class="text-gray-600">Status:</span>
          @if(data.order.orderStatus  === 'NEEDS_DELIVERY' || data.order.orderStatus  === 'PICKUP'){
              <span class="font-medium">Order in Progress</span>
            } @else{
              <span class="font-medium">{{ data.order.orderStatus | titlecase }}</span>
            }
        </div>
        @if(data.order.orderStatus === 'NEEDS_DELIVERY') {
          <div class="flex justify-between">
          <span class="text-gray-600">Estimated delivery by:  </span>
          <span class="font-medium">{{ estimatedDelivery() | date: 'medium'}}</span>
        </div>
        } @else if (data.order.orderStatus === 'PICKUP'){
          <div class="flex justify-between">
          <span class="text-gray-600">Pickup time:  </span>
          <span class="font-medium">{{ estimatedPickup() | date: 'medium'}}</span>
        </div>
        }
        <div class="flex justify-between">
          <span class="text-gray-600">Total:</span>
          <span class="font-medium">{{ data.order.totalPrice | currency }}</span>
        </div>
        
        <h3 class="font-bold text-lg mt-4 mb-2 border-b pb-2">Items</h3>
        <div class="flex flex-col gap-3">
          @for(item of data.order.orderItems; track item.product.productId) {
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img [src]="item.product.image" class="w-12 h-12 rounded object-cover" />
                <div class="flex flex-col">
                  <span class="font-medium">{{ item.product.productName }}</span>
                  <span class="text-xs text-gray-500">Qty: {{ item.quantity }}</span>
                </div>
              </div>
              <span class="font-medium">{{ item.product.specialPrice * item.quantity | currency }}</span>
            </div>
          }
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class OrderDetailsDialog {
  data = inject<{order: Order}>(MAT_DIALOG_DATA);

  estimatedDelivery(): Date {
    const orderDate = new Date(this.data.order.orderDateTime);
    orderDate.setDate(orderDate.getDate() + 1);
    return orderDate;
  }
  estimatedPickup(): Date {
    const orderDate = new Date(this.data.order.orderDateTime);
    orderDate.setMinutes(orderDate.getMinutes() + 15);
    return orderDate;
  }

}
