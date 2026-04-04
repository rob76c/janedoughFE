import { Component, inject, signal } from '@angular/core';
import { BackButton } from '@/src/app/shared/ui/back-button/back-button';
import { WishlistPreview } from '../../../../domains/cart/feature/wishlist-preview/wishlist-preview';
import { OrderSummary } from '../../../../domains/cart/feature/order-summary/order-summary';
import { MatAnchor, MatButton } from '@angular/material/button';
import { ListCartItems } from '@/src/app/domains/cart/feature/list-cart-items/list-cart-items';
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CheckoutStore } from '@/src/app/domains/checkout/data-access/checkout.store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ShippingForm } from "@/src/app/domains/checkout/feature/shipping-form/shipping-form";
import { AddressPicker } from "@/src/app/domains/checkout/feature/address-picker/address-picker";

@Component({
  selector: 'webapp-shopping-cart',
  imports: [
    BackButton,
    ListCartItems,
    WishlistPreview,
    OrderSummary,
    MatButton,
    MatButtonToggleModule,
    ShippingForm,
    AddressPicker
],
  template: `
    <div class="mx-auto max-w-[1200px] py-6">
      <app-back-button class="mb-6" navigateTo="/products/all">Continue Shopping </app-back-button>
      <h1 class="text-3xl font-bold mb-4">Shopping Cart</h1>

      <webapp-wishlist-preview class="mb-6 block" />

      <mat-button-toggle-group class="large-toggle mb-6 w-md " [value]="deliveryMethod()" 
        (change)="deliveryMethod.set($event.value)">
        <mat-button-toggle class="w-1/2" value="delivery">Delivery</mat-button-toggle>
        <mat-button-toggle class="w-1/2" value="pickup">Pickup</mat-button-toggle>
      </mat-button-toggle-group>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
        @if (deliveryMethod() === 'delivery') {
        @if (isCreatingAddress()) {
            <webapp-shipping-form 
              (addressCreated)="onAddressCreated($event)"
              (cancel)="isCreatingAddress.set(false)" />
          } @else {
            <webapp-address-picker 
                title="Shipping Address"
                icon="local_shipping"
                (addressSelected)="checkoutStore.setSelectedShippingAddress($event)" 
                (createNew)="isCreatingAddress.set(true)" />
          }
        }
          <webapp-list-cart-items class="block mt-6" />
        </div>
        <div>
          <webapp-order-summary>
            <ng-container actionButtons>
              <button
                matButton="filled"
                class="w-full mt-6 py-3"
                (click)="checkoutStore.proceedToCheckout()"
              >
                Proceed to Checkout
              </button>
            </ng-container>
          </webapp-order-summary>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export default class ShoppingCart {
  checkoutStore = inject(CheckoutStore);

  deliveryMethod = signal<'delivery' | 'pickup'>('pickup');
  isCreatingAddress = signal(false);

  onAddressCreated(newAddress: any) {
    // Switch back to the picker view. Since it uses an @if block, Angular will
    // destroy and recreate the AddressPicker component, naturally triggering 
    // its ngOnInit to fetch the updated list of addresses!
    this.isCreatingAddress.set(false);
  }
}
