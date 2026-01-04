import { Component, computed, inject, input } from '@angular/core';
import { CatalogStore } from '../../data-access/catalog.store';
import { Product } from '../../model/product';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'webapp-toggle-wishlist-button',
  imports: [MatIcon, MatIconButton],
  template: `
    <button
      [class]="isInWishlist() ? '!text-red-500' : 'text-gray-400'"
      matIconButton
      (click)="toggleWishlist(product())"
    >
      <mat-icon>{{ isInWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
    </button>
  `,
  styles: ``,
})
export class ToggleWishlistButton {
  product = input.required<Product>();
  store = inject(CatalogStore);
  isInWishlist = computed(() =>
    this.store.wishlistItems().find((p) => p.productId === this.product().productId)
  );
  toggleWishlist(product: Product) {
    if (this.isInWishlist()) {
      this.store.removeFromWishlist(product);
    } else {
      this.store.addToWishlist(product);
    }
  }
}
