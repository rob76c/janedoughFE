import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { ShippingAddress } from "../../orders/model/order";
import { computed, inject } from "@angular/core";
import { CatalogStore } from "../../catalog/data-access/catalog.store";
import { SignInDialog } from "../../auth/feature/sign-in-dialog/sign-in-dialog";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthStore } from "../../auth/data-access/auth.store";

export type CheckoutState = {
    selectedBillingAddress: ShippingAddress | undefined;
    selectedShippingAddress: ShippingAddress | undefined;
    loading: boolean,
    orderFulfillmentMethod: 'PICKUP' | 'DELIVERY';
    tip: number;
    tipType: 'PERCENTAGE' | 'CUSTOM'; 
};

const initialState: CheckoutState = {
    selectedBillingAddress: undefined,
    selectedShippingAddress: undefined,
    loading: false,
    orderFulfillmentMethod: 'PICKUP',
    tip: 15,
    tipType: 'PERCENTAGE'
};

export const CheckoutStore = signalStore (
    { providedIn: 'root' },

    withState(initialState),

    withComputed((store) => {
        const catalogStore = inject(CatalogStore);
        const authStore = inject(AuthStore);
        const subtotal = computed(() => catalogStore.cartItems().reduce((acc, item) => acc + item.product.specialPrice * item.quantity, 0));
        
        return {
            cartItems: computed(() => catalogStore.cartItems()),
            user: computed(() => authStore.user()),
            subtotal,
            
            tipAmount: computed(() => {
                if (store.orderFulfillmentMethod() !== 'DELIVERY') return 0;
                return store.tipType() === 'PERCENTAGE' ? subtotal() * (store.tip() / 100) : store.tip();
            })
        };
    }),

    withMethods((store) => {
      const catalogStore = inject(CatalogStore);
        const matDialog = inject(MatDialog);
        const router = inject(Router);
        const authStore = inject(AuthStore);

        return {
        
        setSelectedBillingAddress(address: any | undefined) {
            patchState(store, { selectedBillingAddress: address });
        },

        setSelectedShippingAddress(address: any | undefined) {
            patchState(store, { selectedShippingAddress: address });
        },

        setOrderFulfillmentMethod(method: 'PICKUP' | 'DELIVERY') {
            patchState(store, { orderFulfillmentMethod: method });
        },

        setTip(tipAmount: number, type: 'PERCENTAGE' | 'CUSTOM' = 'PERCENTAGE') {
            patchState(store, { tip: tipAmount, tipType: type });
        },

        clearCart: () => {
        catalogStore.clearCart();
      },

      proceedToCheckout: () => {
        if(store.cartItems().length === 0) {
            return;
        }
        if (!authStore.user()) {
          matDialog.open(SignInDialog, {
            disableClose: true,
            data: {
              checkout: true,
            },
          });
          return;
        }
        router.navigate(['/checkout']);
      },
    };
    }),
);