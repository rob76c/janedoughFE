import { Component, inject } from '@angular/core';
import { ViewPanel } from "@/src/app/shared/directives/view-panel";
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { ShowCartItem } from "@/src/app/domains/cart/feature/show-cart-item/show-cart-item";

@Component({
  selector: 'webapp-list-cart-items',
  imports: [ViewPanel, ShowCartItem],
  template: `
    <div webAppViewPanel> 
    <h2 class="text 2xl font-bold mb-4"> Cart Items ({{store.cartCount()}}) </h2>
    <div class="flex flex-col gap-6">
      @for (item of store.cartItems(); track item.product.productId) {
        <webapp-show-cart-item [item]="item"/>
      }
    </div>


    </div>
  `,
  styles: ``,
})
export class ListCartItems {
  store = inject(CatalogStore)
}
