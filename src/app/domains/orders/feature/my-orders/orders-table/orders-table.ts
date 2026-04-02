import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Order} from '../../../model/order';

@Component({
  selector: 'webapp-orders-table',
  imports: [MatTableModule, DatePipe, CurrencyPipe, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="block overflow-x-auto">
      <table mat-table [dataSource]="orders()" class="w-full">
        <!-- Order Column -->
        <ng-container matColumnDef="order">
          <th class="text-lg font-bold" mat-header-cell *matHeaderCellDef>Order Details</th>
          <td mat-cell *matCellDef="let order">
            <div class="flex flex-col gap-1 my-2">
              @for (item of order.orderItems; track item.product.productId) {
                <div class="text-sm">
                  <span class="font-medium">{{ item.product.productName }}</span>
                  <span class="text-gray-500 ml-2">× {{ item.quantity }}</span>
                </div>
              }
            </div>
          </td>
        </ng-container>

        <!-- Order Date Column -->
        <ng-container matColumnDef="orderDate">
          <th class="text-lg font-bold" mat-header-cell *matHeaderCellDef>Order Date</th>
          <td mat-cell *matCellDef="let order">
            {{ order.orderDateTime | date: 'short' }}
          </td>
        </ng-container>

        <!-- Amount Column -->
        <ng-container matColumnDef="amount">
          <th class="text-lg font-bold" mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let order">
            {{ order.totalPrice | currency }}
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th class="text-lg font-bold" mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let order">
            <span
              class="inline-flex items-center justify-start px-3 py-1 rounded-full text-xs font-medium"
              [class.bg-sky-100]="order.orderStatus === 'created'"
              [class.text-sky-800]="order.orderStatus === 'created'"
              [class.bg-emerald-100]="order.orderStatus === 'Order Accepted!'"
              [class.text-emerald-800]="order.orderStatus === 'Order Accepted!'"
            >
              {{ order.orderStatus | titlecase }}
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  styles: ``,
})
export class OrdersTable {
  orders = input.required<Order[]>();
  displayedColumns: string[] = ['order', 'orderDate', 'amount', 'status'];

}
