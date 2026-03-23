import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Order } from '../../../checkout/model/order';


@Component({
  selector: 'app-orders-table',
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
              @for (item of order.lineItems; track item.productId) {
                <div class="text-sm">
                  <span class="font-medium">{{ item.name }}</span>
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
            {{ order.createdAt | date: 'short' }}
          </td>
        </ng-container>

        <!-- Amount Column -->
        <ng-container matColumnDef="amount">
          <th class="text-lg font-bold" mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let order">
            {{ order.amountTotal | currency }}
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th class="text-lg font-bold" mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let order">
            <span
              class="inline-flex items-center justify-start px-3 py-1 rounded-full text-xs font-medium"
              [class.bg-sky-100]="order.status === 'created'"
              [class.text-sky-800]="order.status === 'created'"
              [class.bg-emerald-100]="order.status === 'paid'"
              [class.text-emerald-800]="order.status === 'paid'"
            >
              {{ order.status | titlecase }}
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
})
export class OrdersTable {
  orders = input.required<Order[]>();
  displayedColumns: string[] = ['order', 'orderDate', 'amount', 'status'];
}
