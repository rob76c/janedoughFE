import { Component, inject, signal } from '@angular/core';
import { BackButton } from '@/src/app/shared/ui/back-button/back-button';
import { ShippingForm } from '@/src/app/domains/checkout/feature/shipping-form/shipping-form';
import { PaymentForm } from '@/src/app/domains/checkout/feature/payment-form/payment-form';
import { OrderSummary } from '@/src/app/domains/cart/feature/order-summary/order-summary';
import { CatalogStore } from '@/src/app/domains/catalog/data-access/catalog.store';
import { MatButton } from '@angular/material/button';
import { AddressPicker } from "@/src/app/domains/checkout/feature/address-picker/address-picker";
import { CheckoutStore } from '@/src/app/domains/checkout/data-access/checkout.store';

@Component({
  selector: 'webapp-checkout',
  imports: [BackButton, ShippingForm, PaymentForm, OrderSummary, MatButton, AddressPicker],
  template: `
    <div class="mx-auto max-w-[1200px] py-6">
      <app-back-button class="mb-4" navigateTo="/cart">Back to Cart</app-back-button>
      <h1 class=" text-3xl font-extrabold mb-4">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 flex flex-col gap-6">

        @if (isCreatingAddress()) {
            <webapp-shipping-form 
              (addressCreated)="onAddressCreated($event)"
              (cancel)="isCreatingAddress.set(false)" />
          } @else {
            <webapp-address-picker 
              title="Billing Address"
              icon="local_shipping"
              [showSameAsBillingCheckbox]="true"
              (addressSelected)="checkoutStore.setSelectedAddress($event)" 
              (sameAsBillingChange)="checkoutStore.setShippingSameAsBilling($event)"
              (createNew)="isCreatingAddress.set(true)" />
            
            @if (!checkoutStore.isShippingSameAsBilling()) {
              <webapp-address-picker 
                title="Shipping Address"
                icon="local_shipping"
                [showSameAsBillingCheckbox]="false"
                (addressSelected)="checkoutStore.setSelectedBillingAddress($event)" 
                (createNew)="isCreatingAddress.set(true)" />
            }
          }
          
          @if (checkoutStore.selectedBillingAddress() && checkoutStore.selectedBillingAddress()) {
            <webapp-payment-form />
          }
        </div>
        <div class="lg: col-span-2">
          <webapp-order-summary>
            <ng-container checkoutItems>
              @for (item of checkoutStore.cartItems(); track item.product.productId) {
              <div class="text-sm flex justify-between">
                <span>{{ item.product.productName }} x {{ item.quantity }}</span>
                <span>\${{ (item.product.specialPrice * item.quantity).toFixed(2) }} </span>
              </div>
              }
            </ng-container>

            <ng-container actionButtons>
              <button
                matButton="filled"
                class="w-full mt-6 py-3"
                [disabled]="checkoutStore.loading()"
                (click)="scrollToPayment()"
              >
                Scroll Down 👇👇
              </button>
            </ng-container>
          </webapp-order-summary>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export default class Checkout {
  checkoutStore = inject(CheckoutStore);
  isCreatingAddress = signal(false);

  onAddressCreated(newAddress: any) {
    // Switch back to the picker view. Since it uses an @if block, Angular will
    // destroy and recreate the AddressPicker component, naturally triggering 
    // its ngOnInit to fetch the updated list of addresses!
    this.isCreatingAddress.set(false);
  }

  scrollToPayment() {
    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
