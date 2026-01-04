import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../../model/product';
import { TitleCasePipe } from '@angular/common';
import { StockStatus } from "../stock-status/stock-status";
import { QuantitySelector } from "@/src/app/shared/ui/quantity-selector/quantity-selector";
import { MatButton, MatIconButton } from "@angular/material/button";
import { CatalogStore } from '../../../data-access/catalog.store';
import { MatIcon } from "@angular/material/icon";
import { ToggleWishlistButton } from "../../toggle-wishlist-button/toggle-wishlist-button";

@Component({
  selector: 'webapp-product-info',
  imports: [TitleCasePipe, StockStatus, QuantitySelector, MatButton, MatIcon, ToggleWishlistButton, MatIconButton],
  template: `
    <div class="text-xs rounded-xl bg-gray-100 px-2 py-1 w-fit mb-2"> 
      {{product().category | titlecase}}
    </div>
    <h1 class="text-2xl font-bold mb-3">{{product().productName}}</h1>
    <p class="text-3xl font-bold mb-4">\${{product().price}}</p>
    <webapp-stock-status class="mb-4" [stock]="product().stock"/>
    <p class="font-semibold mb-2">Description</p>
    <p class="text-gray-600 border-b border-gray-200 pb-4"> {{product().description}}</p>
    <div class="flex items-center gap-2 mb-3 pt-4">
      <span class="font-semibold">Quantity</span>
      <webapp-quantity-selector [quantity]="quantity()" (quantityUpdated)="quantity.set($event)" /> 
    </div>
    <div class="flex gap-4 mb border-b border-gray-200 pb-4"> 
      <button matButton="filled" class="w-2/3 flex items-center gap-2" (click)="store.addToCart(product(), quantity())" [disabled]="(product().stock<1)" > 
        <mat-icon>shopping_cart</mat-icon>
        {{(product().stock >1) ? 'Add to Cart' : 'Out of Stock'}}
      </button>
      <webapp-toggle-wishlist-button [product]="product()" />
      <button matIconButton> 
        <mat-icon>share</mat-icon>
      </button>
    </div>

  `,
  styles: ``,
})
export class ProductInfo {
  product = input.required<Product>();
  quantity = signal(1);
  store = inject(CatalogStore);
}
