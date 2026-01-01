import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { Component, computed, inject } from '@angular/core';
import { ViewPanel } from "@/src/app/shared/directives/view-panel";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'webapp-order-summary',
  imports: [ViewPanel, DecimalPipe],
  template: `
    <div webAppViewPanel> 
      <h2 class="text-2xl font-bold mb-4"> Order Summary</h2>

      <div class="space-y-2 pb-4"> 
        <ng-content select="[checkoutItems]" />
      </div>

      <div class="space-y-3 text-lg pt-4"> </div>
      <div class="flex justify-between"> 
        <span>Subtotal</span>
        <span>\$ {{subtotal() | number:'1.2-2'}}</span>
      </div>
      <div class="flex justify-between"> 
        <span>Tax</span>
        <span>\$ {{tax()| number:'1.2-2'}}</span>
      </div>
      <div class="flex justify-between border-t pt-3 font-bold text-lg"> 
        <span>Total</span>
        <span>\$ {{total()| number:'1.2-2'}}</span>
      </div>

      <ng-content select="[actionButtons]" /> 
    </div>
  `,
  styles: ``,
})
export class OrderSummary {
 store = inject(CatalogStore);

 subtotal = computed(() => this.store.cartItems().reduce((acc, item) => acc + item.product.price * item.quantity, 0));

 tax = computed(() => 0.05 * this.subtotal());


 total = computed(() => this.tax() + this.subtotal())
}
