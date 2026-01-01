import { Component, inject } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { ShippingForm } from "@/src/app/domains/checkout/feature/shipping-form/shipping-form";
import { PaymentForm } from "@/src/app/domains/checkout/feature/payment-form/payment-form";
import { OrderSummary } from "@/src/app/domains/cart/feature/order-summary/order-summary";
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';

@Component({
  selector: 'webapp-checkout',
  imports: [BackButton, ShippingForm, PaymentForm, OrderSummary],
  template: `
    
    <div class="mx-auto max-w-[1200px] py-6"> 
      <app-back-button class="mb-4" navigateTo="/cart">Back to Cart</app-back-button>
      <h1 class=" text-3xl font-extrabold mb-4">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6"> 
        <div class="lg:col-span-3 flex flex-col gap-6">
           <webapp-shipping-form />
           <webapp-payment-form />
      </div>
      <div class="lg: col-span-2"> 
        <webapp-order-summary>
          <ng-container checkoutItems> 
            @for (item of store.cartItems(); track item.product.productId) {
              <div class="text-sm flex justify-between"> 
                <span>{{item.product.productName}} x {{item.quantity}}</span>
                <span>\${{(item.product.price * item.quantity).toFixed(2)}} </span>
              </div>
            }
          </ng-container>

        </webapp-order-summary>
      </div>
      </div>
    </div>
  `,
  styles: ``,
})
export default class Checkout {

  store = inject(CatalogStore);

}
