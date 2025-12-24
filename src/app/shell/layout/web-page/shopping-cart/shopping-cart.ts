import { Component } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { ListCartItems } from "./list-cart-items/list-cart-items";
import { WishlistPreview } from "./wishlist-preview/wishlist-preview";
import { OrderSummary } from "./order-summary/order-summary";

@Component({
  selector: 'app-shopping-cart',
  imports: [BackButton, ListCartItems, WishlistPreview, OrderSummary],
  template: `
    <div class="mx-auto max-w-[1200px] py-6"> 
      <app-back-button class="mb-6" navigateTo="/products/all">Continue Shopping </app-back-button>
      <h1 class="text-3xl font-bold mb-4">Shopping Cart</h1>

      <webapp-wishlist-preview class="mb-6 block"/>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <webapp-list-cart-items/>
        </div>
        <div> 
          <webapp-order-summary />

        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export default class ShoppingCart {

}
