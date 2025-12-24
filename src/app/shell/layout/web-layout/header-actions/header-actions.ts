import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatBadge } from '@angular/material/badge';
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';

@Component({
  selector: 'webapp-header-actions',
  imports: [MatButton, MatIconButton, MatIcon, RouterLink, MatBadge],
  template: `
    <div class="flex items-center gap-2">
      <button
        matIconButton
        routerLink="/wishlist"
        [matBadge]="store.wishlistCount()"
        [matBadgeHidden]="store.wishlistCount() === 0"
      >
        <mat-icon>favorite</mat-icon>
      </button>
      <button
        matIconButton
        [matBadge]="store.cartCount()"
        [matBadgeHidden]="store.cartCount() === 0"
        routerLink="/cart"
      >
        <mat-icon>shopping_cart</mat-icon>
      </button>
      <button>Sign in</button>
      <button matButton="filled">Sign up</button>
    </div>
  `,
  styles: ``,
})
export class HeaderActions {
  store = inject(CatalogStore);
}
