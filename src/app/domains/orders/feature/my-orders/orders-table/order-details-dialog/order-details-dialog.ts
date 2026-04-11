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
          <span class="font-medium">{{ estimatedTime | date: 'short'}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Delivery Fee:  </span>
          <span class="font-medium">{{ data.order.deliveryFee| currency}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Tip:  </span>
          <span class="font-medium">{{ data.order.tip| currency}}</span>
        </div>
        } @else if (data.order.orderStatus === 'PICKUP'){
          <div class="flex justify-between">
          <span class="text-gray-600">Pickup time:  </span>
          <span class="font-medium">{{ estimatedTime | date: 'medium'}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Pickup at:  </span>
          <span class="font-medium">76 Lake St Jersey City, NJ 07306</span>
        </div>
        }

        <div class="flex justify-between">
          <span class="text-gray-600">Tax:  </span>
          <span class="font-medium">{{ data.order.tax | currency}}</span>
        </div>
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

  get estimatedTime(): Date {
    const order = this.data.order;
    const orderDate = new Date(order.orderDateTime);
    
    let maxDelayMinutes = 0; 
    const isDelivery = order.orderStatus === 'NEEDS_DELIVERY';

    for (const item of order.orderItems) {
      const name = item.product.productName;
      
      if (isDelivery) {
        if (name === 'Classic Carrot Cake' || name === 'Chocolate Carrot Cake') {
          maxDelayMinutes = Math.max(maxDelayMinutes, 24 * 60); // +1 day
        } else if (name === 'Carrera Classic Protein Shake') {
          maxDelayMinutes = Math.max(maxDelayMinutes, 30); // +30 minutes
        }
      } else {
        // Evaluate for Pickup
        if (name === 'Classic Carrot Cake' || name === 'Chocolate Carrot Cake') {
          maxDelayMinutes = Math.max(maxDelayMinutes, 2 * 60); // +2 hours
        } else if (name === 'Carrera Classic Protein Shake') {
          maxDelayMinutes = Math.max(maxDelayMinutes, 10); // +10 minutes
        }
      }
    }

    // Add the maximum required delay to the original order time
    return new Date(orderDate.getTime() + maxDelayMinutes * 60000);
  }

}
