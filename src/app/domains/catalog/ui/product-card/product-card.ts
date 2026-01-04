import { Product } from '@/src/app/domains/catalog/model/product';
import { Component, inject, input, output } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CatalogStore } from '../../data-access/catalog.store';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'products-card',
  imports: [MatButton, MatIcon, RouterLink],
  template: `
    <div class = "relative bg-white cursor-pointer rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl">
      
        <img [src]="product().image" class="w-full h-[300px] object-cover rounded-t-xl" [routerLink]="['/product', product().productId]" />

        <ng-content />
        <div class = "p-5 flex flex-col flex-1" [routerLink]="['/product', product().productId]">
          <h3 class="text-lg font-semibold text-gray-900  mb-2 leading-tight">
            {{product().productName}}
          </h3>
          <p class = "text-sm text-gray-600 mb-4 flex-1 leading-relaxed" >
            {{product().description}}
          </p>
          
          <div class="text-sm font-medium mb-4"> 
            {{product().stock ? 'In Stock' : 'SOLD OUT' }}
          </div>

          <div class = "flex items-center justify-between mt-auto">
            <span class = "text-2xl font-bold text-gray-900">
              \${{product().price}}
            </span>
            <button matButton="filled" class = "flex items-center gap-2" (click)="store.addToCart(product(), 1)">
              <mat-icon>shopping_cart</mat-icon>
              Add to Cart    
          </button>
        </div>
      </div>
  `,
  styles: ``,
})
export class ProductsCard {
  product = input.required<Product>();
  store = inject(CatalogStore)
}
