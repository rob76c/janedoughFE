import { CartItem } from '@/src/app/domains/catalog/model/cart-item';
import { Component, computed, inject, input } from '@angular/core';
import { QuantitySelector } from "@/src/app/shared/ui/quantity-selector/quantity-selector";
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'webapp-show-cart-item',
  imports: [QuantitySelector, MatIconButton, MatIcon],
  template: `
    <div class="grid grid-cols-3 grid-cols-[3fr_1fr_1fr]">
      <div class="flex items-center gap-4">
        <img [src]="item().product.image" class="w-24 h-24 rounded-lg object-cover" />
        <div>
          <div class="text-gray-900 text-lg font-semibold">{{item().product.productName}} </div>
          <div class="text-gray-600 text-lg">\${{item().product.price}} </div>   
        </div> 
      </div>
      <webapp-quantity-selector [quantity]="item().quantity" (quantityUpdated)="store.setItemQuantity({productId: item().product.productId, quantity: $event})" />

      <div class="flex flex-col items-end"> 
        <div class="text-right font-semibold text-lg">
          \${{total()}}
        </div>
        <div class="flex -me-3">
        <button matIconButton (click)="store.moveToWishlist(item().product)">
          <mat-icon>favorite_border</mat-icon>
        </button>
        <button matIconButton class="danger" (click)="store.removeFromCart(item().product)">
          <mat-icon>delete</mat-icon>
        </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ShowCartItem {
  item = input.required<CartItem>();
  store = inject(CatalogStore);

  total = computed(() => (this.item().product.price * this.item().quantity).toFixed(2))
}
