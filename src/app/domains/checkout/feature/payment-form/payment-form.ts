import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { ViewPanel } from "@/src/app/shared/directives/view-panel";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/src/environments/environment';
import { CatalogStore } from '../../../catalog/data-access/catalog.store';
import { patchState } from '@ngrx/signals';
import { OrderService } from '../../../orders/data-access/order.service';
import { Router } from '@angular/router';
import { CheckoutStore } from '../../data-access/checkout.store';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'webapp-payment-form',
  imports: [MatIcon, ViewPanel, MatRadioButton, MatRadioGroup, DecimalPipe],
  template: `
    <div webAppViewPanel id="payment-section"> 
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2"> 
        <mat-icon>payment</mat-icon>
        Payment Options
      </h2>
      <div> 
        <mat-radio-group [value]="'stripe'"> 
          <mat-radio-button value="stripe"> 
            <img src="assets/imgs/stripe-logo.png" alt="Stripe" class="h-6" />
          </mat-radio-button>
        </mat-radio-group>
      </div>

      <form id="payment-form" (submit)="handleSubmit($event)" class="w-full flex flex-col">
        <div id="payment-element" #paymentElement class="mb-6">
          </div>

        <button 
          id="submit" 
          type="submit" 
          [disabled]="checkoutStore.loading() || !stripeElements()"
          class="w-full bg-[#0055DE] hover:brightness-110 text-white font-semibold py-3 px-4 rounded-md shadow-[0px_4px_5.5px_0px_rgba(0,0,0,0.07)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12"
        >
          @if (isLoading()) {
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          } @else {
            <span>Pay now \${{ totalAmount() | number:'1.2-2' }}</span>
          }
        </button>

        @if (errorMessage()) {
          <div class="text-[#697386] text-center mt-3 text-base leading-5">
            {{ errorMessage() }}
          </div>
        }
      </form>
    </div>
  `
})
export class PaymentForm implements OnInit {
  @ViewChild('paymentElement', { static: true }) paymentElementRef!: ElementRef;

  // Injections
  checkoutStore = inject(CheckoutStore);
  http = inject(HttpClient);
  orderService = inject(OrderService);
  router = inject(Router);

  // Local Signals
  stripe = signal<Stripe | null>(null);
  stripeElements = signal<StripeElements | null>(null);
  isLoading = signal(false); // Using local state for form submission
  errorMessage = signal<string | null>(null);
  totalAmount = signal<number>(0);

  async ngOnInit() {
    // Initialize Stripe using the Publishable Key from environment
    const stripeInstance = await loadStripe(environment.pubKey);
    this.stripe.set(stripeInstance);
    this.initializeStripe();
  }

  initializeStripe() {
    const cartItems = this.checkoutStore.cartItems();
    const user = this.checkoutStore.user();
    const address = this.checkoutStore.selectedAddress();

    if (cartItems.length === 0) return;
    if (!user || !address) return;

    // Calculate total in cents for Stripe
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.specialPrice * item.quantity, 0);
    const tax = 0.06625 * subtotal;
    const totalAmount = subtotal + tax;
    const stripeTotalAmount = Math.round((subtotal + tax) * 100);
    this.totalAmount.set(totalAmount);
    
    // Build payload matching your backend StripePaymentDto
    const stripePaymentDto = {
      amount: stripeTotalAmount,
      currency: 'usd',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      description: 'Jane Dough Order',
      // Note: Providing a dummy address so StripeServiceImpl.java doesn't throw NullPointerException.
      // You should eventually pass the real address values from your ShippingForm.
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country
      }
    };

    // Fetch the PaymentIntent client secret.
    // Important: responseType is 'text' because your Spring Boot controller returns a raw String, not a JSON object.
    this.http.post(`${environment.apiUrl}/stripe-client-secret`, stripePaymentDto, {withCredentials:true, responseType: 'text' })
      .subscribe({
        next: (clientSecret: string) => {
          const stripeInstance = this.stripe();
          if (!stripeInstance) return;

          // Configure and mount Stripe Elements
          const elements = stripeInstance.elements({
            appearance: { theme: 'stripe' },
            clientSecret: clientSecret
          });
          
          this.stripeElements.set(elements);

          const paymentElement = elements.create("payment", { layout: "accordion" });
          paymentElement.mount(this.paymentElementRef.nativeElement);
        },
        error: (err) => {
          console.error("Error creating payment intent", err);
          this.errorMessage.set("Failed to initialize payment. Please try again.");
        }
      });
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const stripeInstance = this.stripe();
    const elements = this.stripeElements();
    const selectedAddress = this.checkoutStore.selectedAddress();

    if (!stripeInstance || !elements) return;

    // Trigger local loading signal
    this.isLoading.set(true);

    const { error, paymentIntent } = await stripeInstance.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:4200/order-success",
      },
      redirect: 'if_required' 
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        this.showMessage(error.message || 'An error occurred.');
      } else {
        this.showMessage("An unexpected error occurred.");
      }
      this.isLoading.set(false);
      return;
    }

    // Payment is confirmed successfully! Create the backend Order.
    if (paymentIntent && selectedAddress && paymentIntent.status === 'succeeded') {
      const orderRequest = {
        addressId: selectedAddress.addressId, // Ensure this matches an actual address ID logic later from your Shipping Form
        paymentMethod: 'ONLINE',
        pgName: 'Stripe',
        pgPaymentId: paymentIntent.id,
        pgStatus: paymentIntent.status,
        pgResponseMessage: 'Payment Successful'
      };

      this.orderService.orderCompleted('ONLINE', orderRequest).subscribe({
        next: (order) => {
          // Clear frontend cart items inside the store to reflect empty cart
          this.checkoutStore.clearCart();
          this.isLoading.set(false);
          this.router.navigate(['/order-success']);
        },
        error: (err) => {
          console.error('Order Backend Error:', err);
          this.showMessage('Payment succeeded, but order creation failed. Please contact support.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  showMessage(messageText: string) {
    this.errorMessage.set(messageText);
    setTimeout(() => {
      this.errorMessage.set(null);
    }, 4000);
  }
}