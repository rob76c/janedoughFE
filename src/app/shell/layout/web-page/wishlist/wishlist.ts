import { Component, inject } from '@angular/core';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { ProductsCard } from "@/src/app/domains/catalog/ui/product-card/product-card";
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from "@angular/material/button";
import { EmptyWishlist } from "@/src/app/shared/ui/empty-wishlist/empty-wishlist";
@Component({
  selector: 'webapp-wishlist',
  imports: [BackButton, ProductsCard, MatIcon, MatButton, EmptyWishlist],
  template: `
    <div class="mx-auto max-w-[1200px] py-6 px-4">
      <app-back-button class = "mb-6" navigateTo="/products/all"> Continue Shopping </app-back-button>
    
      @if(store.wishlistCount() > 0) {
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold"> My Wishlist </h1>
          <span class="text-gray-500 text-xl"> {{store.wishlistCount()}} items </span>
        </div>

        <div class="responsive-grid"> 
          @for (product of store.wishlistItems(); track product.productId) {
            <products-card [product]="product"> 
              <button
      class="!absolute z-10 top-3 right-3 !bg-white shadow-md rounded-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
      matIconButton
      (click)="store.removeFromWishlist(product)"
    >
      <mat-icon>delete</mat-icon>
    </button>
            </products-card>
          }
        </div>

        <div class="mt-8 flex justify-center"> 
          <button matButton="outlined" class="danger" (click)="store.clearWishlist()"> 
            Clear Wishlist
          </button>
        </div>

      } @else {
          <webapp-empty-wishlist />
      }
    </div>
  `,
  styles: ``,
})
export default class Wishlist {
  store = inject(CatalogStore);
}
