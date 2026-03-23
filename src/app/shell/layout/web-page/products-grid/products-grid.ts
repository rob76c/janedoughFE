import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ProductsCard } from '@/src/app/domains/catalog/ui/product-card/product-card';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { TitleCasePipe } from '@angular/common';
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { ToggleWishlistButton } from '@/src/app/domains/catalog/ui/toggle-wishlist-button/toggle-wishlist-button';
import { ResponsiveManagerService } from '@/src/app/shared/util/responsive-manager.service';
import { SideMenu } from "../side-menu/side-menu";
@Component({
  selector: 'webapp-products-grid',
  imports: [
    ProductsCard,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    TitleCasePipe,
    ToggleWishlistButton,
    SideMenu
],
providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-sidenav-container class="h-full">
      <mat-sidenav
        #sidenav
        [mode]="responsiveManager.sideNavMode()"
        (openedChange)="responsiveManager.sideNavOpened.set($event)"
        [opened]="responsiveManager.sideNavOpened()"
      >
      <webapp-side-menu/>
      </mat-sidenav>

      <mat-sidenav-content class="bg-gray-100 p-6 h-full">
        <div class="flex items-center justify-between mb-6">
          <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ currentCategoryLabel() | titlecase }}
        </h1>
        <p class="text-base text-gray-600 mb-6">
          {{ store.filteredProducts().length }} products found
        </p>
          </div>
        </div>

        <div class="responsive-grid">
          @for (product of store.filteredProducts(); track product.productId) {
          <products-card [product]="product">
            <webapp-toggle-wishlist-button
              class="!absolute z-10 top-3 right-3 !bg-white shadow-md rounded-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
              [product]="product"
            />
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
  responsiveManager = inject(ResponsiveManagerService);

  categories = signal([
    { id: 'all', label: 'All' },
    { id: '1', label: 'Cookies' },
    { id: '2', label: 'Coming Soon' },
  ]);

  currentCategoryLabel = computed(() => {
    const found = this.categories().find((c) => c.id === this.category());
    return found ? found.label : ' ';
  });
  constructor() {
    effect(() => {
      this.store.setCategory(this.category());
    });
  }
}
