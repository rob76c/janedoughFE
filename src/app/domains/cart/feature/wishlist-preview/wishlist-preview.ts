import { Component, inject } from '@angular/core';
import { ViewPanel } from "@/src/app/shared/directives/view-panel";
import { MatIcon } from "@angular/material/icon";
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { MatAnchor, MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'webapp-wishlist-preview',
  imports: [ViewPanel, MatIcon, MatButton, RouterLink],
  template: `
    <div webAppViewPanel class="flex items-center justify-between"> 
      <div class="flex items-center gap-3"> 
        <mat-icon class="!text-red-500">favorite_border</mat-icon>
        <div> 
          <h2 class="text-xl font-bold"> Wishlist {{store.wishlistCount()}} </h2>
          <p class="text-gray-500 text-sm"> You have {{store.wishlistCount()}} items saved for later </p>
        </div>
      </div>
      <div class="flex items-center gap-3"> 
        <button matButton routerLink="/wishlist">View All</button>
        <button matButton="filled" class="flex items-center gap-2" (click)="store.addAllWishlistToCart()">
          <mat-icon>shopping_cart</mat-icon>
          Add all to Cart
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class WishlistPreview {
  store = inject(CatalogStore);
}
