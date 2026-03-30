import { Product } from '@/src/app/domains/catalog/model/product';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CatalogStore } from '../../data-access/catalog.store';
import { RouterLink } from "@angular/router";
import { QuantitySelector } from "@/src/app/shared/ui/quantity-selector/quantity-selector";

@Component({
  selector: 'products-card',
  imports: [MatButton, MatIcon, RouterLink, QuantitySelector],
  template: `
    <div class = "relative bg-white cursor-pointer rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl">
      
        <img [src]="product().image" class="w-full h-[300px] object-cover rounded-t-xl" [routerLink]="['/product', product().productId]" />

        <ng-content />
        <div class = "p-5 flex flex-col flex-1">
          <h3 class="text-lg font-semibold text-gray-900  mb-2 leading-tight" [routerLink]="['/product', product().productId]">
            {{product().productName}}
          </h3>
          <p class = "text-sm text-gray-600 mb-4 flex-1 leading-relaxed" [routerLink]="['/product', product().productId]">
            {{product().description}}
          </p>
          
          <div class="text-sm font-medium mb-4" [routerLink]="['/product', product().productId]"> 
            {{(product().stock>1) ? 'In Stock' : 'SOLD OUT' }}
          </div>

          <div class = "flex items-center justify-between mt-auto">
            <span class = "text-2xl font-bold text-gray-900" [routerLink]="['/product', product().productId]">
              \${{product().specialPrice}}
            </span>

            @if (quantityInCart() > 0) {
              <webapp-quantity-selector 
                class="w-2/3 flex justify-end pr-2"
                [quantity]="quantityInCart()" 
                (quantityUpdated)="updateQuantity($event)" 
              />
            } @else {

            <button matButton="filled" class="w-2/3 flex items-center gap-2" (click)="store.addToCart(product(), quantity())" [disabled]="(product().stock<1)" > 
        <mat-icon>shopping_cart</mat-icon>
        {{(product().stock >1) ? 'Add to Cart' : 'Out of Stock'}}
      </button>
            }
        </div>
      </div>
  `,
  styles: ``,
})
export class ProductsCard {
  product = input.required<Product>();
  store = inject(CatalogStore);
  quantity = signal(1);


  quantityInCart = computed(() => {
    const cartItem = this.store.cartItems().find(item => item.product.productId === this.product().productId);
    return cartItem ? cartItem.quantity : 0;
  });

  // Handler for the quantity selector emissions
  updateQuantity(newQuantity: number) {
    this.store.setItemQuantity({ 
      productId: this.product().productId, 
      quantity: newQuantity 
    });
  }
}
