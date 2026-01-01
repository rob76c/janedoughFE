import { Component, inject } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { WishlistPreview } from "../../../../domains/cart/feature/wishlist-preview/wishlist-preview";
import { OrderSummary } from "../../../../domains/cart/feature/order-summary/order-summary";
import { MatAnchor, MatButton } from "@angular/material/button";
import { ListCartItems } from "@/src/app/domains/cart/feature/list-cart-items/list-cart-items";
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';

@Component({
  selector: 'app-shopping-cart',
  imports: [BackButton, ListCartItems, WishlistPreview, OrderSummary, MatButton],
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
          <webapp-order-summary>
            <ng-container actionButtons> 
              <button matButton="filled" class="w-full mt-6 py-3" (click)="store.proceedToCheckout()">
                Proceed to Checkout
              </button>
          </ng-container>
          </webapp-order-summary>

        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export default class ShoppingCart {

  store = inject(CatalogStore);
}
