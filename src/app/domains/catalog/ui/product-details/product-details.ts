import { Component, computed, inject, input } from '@angular/core';
import { CatalogStore } from '../../data-access/catalog.store';
import { BackButton } from "@/src/app/shared/ui/back-button/back-button";
import { ProductInfo } from "./product-info/product-info";

@Component({
  selector: 'webapp-product-details',
  imports: [BackButton, ProductInfo],
  template: `
    <div class="mx-auto max-w-[1200px] py-6"> 
      <app-back-button class="mb-6" [navigateTo]="backRoute()"> Continue Shopping </app-back-button>
      @if(store.selectedProduct(); as product) {
        <div class="flex gap-8 mb-8">
          <img [src]="product.image" class="w-[500px] h-[500px] object-cover rounded lg" />
          <div class="flex-1">
            <webapp-product-info [product]="product" />

          </div>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export default class ProductDetails {
  productId = input.required<string>();
  store = inject(CatalogStore);

  constructor() {
    this.store.setProductId(this.productId);
  }

  backRoute = computed(() => `/products/${this.store.selectedCategory()}`);

}
