import { Product } from '@/src/app/domains/catalog/model/product';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ProductsCard } from '@/src/app/domains/catalog/ui/product-card/product-card';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list'
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { ToggleWishlistButton } from "@/src/app/domains/catalog/ui/toggle-wishlist-button/toggle-wishlist-button";
@Component({
  selector: 'webapp-products-grid',
  imports: [ProductsCard, MatSidenav, MatSidenavContainer, MatSidenavContent, MatNavList, MatListItem, MatListItemTitle, RouterLink, TitleCasePipe, ToggleWishlistButton],
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened="true"> 
        <div class = "p-6">
          <h2 class = "text-lg text-gray-900">Categories</h2>
          <mat-nav-list>
            @for (cat of categories(); track cat) {
              <mat-list-item [activated]="cat === category()" class = "my-2" [routerLink]="['/products', cat]">
                <span matListItemTitle class="font-medium" [class]="cat ===category() ? 'text-white' : null">
                  {{cat | titlecase}}
                </span> 

              </mat-list-item>
            }
          </mat-nav-list>
        </div>    
    </mat-sidenav>
      <mat-sidenav-content class="bg-gray-100 p-6 h-full">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ category() | titlecase}}
        </h1>
        <p class = "text-base text-gray-600 mb-6">
          {{store.filteredProducts().length}} products found
        </p>
        <div class="responsive-grid">
          @for (product of store.filteredProducts(); track product.productId) {
          <products-card [product]="product">
            <webapp-toggle-wishlist-button class= "!absolute z-10 top-3 right-3 w-10 h-10 rounded-full" [product]="product"/>    
        </products-card>
          }
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: ``,
})
export default class ProductsGrid {
  category = input<string>('all');

  store = inject(CatalogStore);

  categories = signal<string[]>(['all', 'cookies', 'Coming Soon']);

  constructor() {
    this.store.setCategory(this.category);
  }
}
