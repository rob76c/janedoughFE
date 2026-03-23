import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";

@Component({
  selector: 'app-my-orders',
  imports: [BackButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-[1200px] py-6 px-4">
      <app-back-button class="mb-6" navigateTo="/products/all">Continue Shopping</app-back-button>
      <h1 class="text-2xl font-bold mb-6">My Orders</h1>
  `,
  styles: ``,
})
export class MyOrders {

}
