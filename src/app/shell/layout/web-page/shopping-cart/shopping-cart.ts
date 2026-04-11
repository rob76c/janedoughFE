import { Component, inject, signal } from '@angular/core';
import { BackButton } from '@/src/app/shared/ui/back-button/back-button';
import { WishlistPreview } from '../../../../domains/cart/feature/wishlist-preview/wishlist-preview';
import { OrderSummary } from '../../../../domains/cart/feature/order-summary/order-summary';
import { MatButton } from '@angular/material/button';
import { ListCartItems } from '@/src/app/domains/cart/feature/list-cart-items/list-cart-items';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CheckoutStore } from '@/src/app/domains/checkout/data-access/checkout.store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ShippingForm } from "@/src/app/domains/checkout/feature/shipping-form/shipping-form";
import { AddressPicker } from "@/src/app/domains/checkout/feature/address-picker/address-picker";
import { SignInDialog } from '@/src/app/domains/auth/feature/sign-in-dialog/sign-in-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ViewPanel } from '@/src/app/shared/directives/view-panel';
import { MatIcon } from "@angular/material/icon";

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
    AddressPicker,
    ViewPanel,
    MatIcon,
    MatFormFieldModule, 
    MatInputModule
],
  template: `
    <div class="mx-auto max-w-[1200px] py-6">
      <app-back-button class="mb-6" navigateTo="/products/all">Continue Shopping </app-back-button>
      <h1 class="text-3xl font-bold mb-4">Shopping Cart</h1>

      <webapp-wishlist-preview class="mb-6 block" />

      <mat-button-toggle-group class="large-toggle mb-6 w-md " [value]="checkoutStore.orderFulfillmentMethod()" 
        (change)="handleFulfillmentChange($event.value)">
        <mat-button-toggle class="w-1/2" value="DELIVERY">Delivery</mat-button-toggle>
        <mat-button-toggle class="w-1/2" value="PICKUP">Pickup</mat-button-toggle>
      </mat-button-toggle-group>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
        @if (checkoutStore.orderFulfillmentMethod() === 'DELIVERY') {
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
        <div class="mt-6 bg-white p-6 rounded-xl border border-gray-200">
              <span class="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                <mat-icon class="text-gray-700">volunteer_activism</mat-icon>
                Driver Tip
              </span>
        <mat-button-toggle-group class="w-full flex" 
          [value]="checkoutStore.tipType() === 'PERCENTAGE' ? checkoutStore.tip().toString() : 'custom'" 
          (change)="onTipToggleChange($event.value)">
        <mat-button-toggle class="flex-1" value="10">10%</mat-button-toggle>
        <mat-button-toggle class="flex-1" value="15">15%</mat-button-toggle>
        <mat-button-toggle class="flex-1" value="20">20%</mat-button-toggle>
      </mat-button-toggle-group>
      @if (isCustomTip()) {
                <div class="mt-4">
                  <mat-form-field class="w-full" appearance="outline">
                    <span matTextPrefix>$&nbsp;</span>
                    <input matInput type="number" min="0" step="0.01" placeholder="Enter custom amount"
                           [value]="customTipText()"
                           (input)="onCustomTipInput($event)">
                  </mat-form-field>
                </div>
              }

              <div class="flex justify-between items-center mt-3">
                <p class="text-sm text-gray-500">100% of the tip goes to your driver.</p>
                <button mat-button class="text-blue-600" (click)="toggleCustomTip()">Custom Tip</button>
              </div>
            </div>
          }
        

          <webapp-list-cart-items class="block mt-6" />
        </div>
        <div>
          <webapp-order-summary>
            <ng-container actionButtons>
              <button
                matButton="filled"
                class="w-full mt-6 py-3"
                [disabled]="checkoutStore.cartItems().length === 0"
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
  matDialog = inject(MatDialog);

  isCreatingAddress = signal(false);
  isCustomTip = signal(this.checkoutStore.tipType() === 'CUSTOM');
  
  customTipText = signal<string>(
    this.checkoutStore.tipType() === 'CUSTOM' && this.checkoutStore.tip() > 0 
      ? this.checkoutStore.tip().toString() 
      : ''
  );

  onAddressCreated(newAddress: any) {
    // Switch back to the picker view. Since it uses an @if block, Angular will
    // destroy and recreate the AddressPicker component, naturally triggering 
    // its ngOnInit to fetch the updated list of addresses!
    this.isCreatingAddress.set(false);
  }
  handleFulfillmentChange(method: 'PICKUP' | 'DELIVERY') {
    if (method === 'DELIVERY' && !this.checkoutStore.user()) {
      this.checkoutStore.setOrderFulfillmentMethod('PICKUP');
      
      this.matDialog.open(SignInDialog, {
        disableClose: true,
      });
      return;
    }
    this.checkoutStore.setOrderFulfillmentMethod(method);
  }

  onTipToggleChange(value: string) {
    this.isCustomTip.set(false);
    this.checkoutStore.setTip(Number(value), 'PERCENTAGE');
  }

  toggleCustomTip() {
    this.isCustomTip.set(true);
    if (this.checkoutStore.tipType() !== 'CUSTOM') {
      this.checkoutStore.setTip(0, 'CUSTOM');
      this.customTipText.set('');
    }
  }

  onCustomTipInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customTipText.set(val);
    this.checkoutStore.setTip(Number(val) || 0, 'CUSTOM');
  }
  
}
