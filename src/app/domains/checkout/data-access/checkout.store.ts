import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { ShippingAddress } from "../../orders/model/order";
import { CartItem } from "../../catalog/model/cart-item";
import { loadCartFromStorage } from "../../cart/data-access/cart.service";
import { computed, effect, inject } from "@angular/core";
import { User } from "../../auth/model/user";
import { loadUserFromSession } from "../../auth/data-access/auth.service";
import { CatalogStore } from "../../catalog/data-access/catalog.store";
import { SignInDialog } from "../../auth/feature/sign-in-dialog/sign-in-dialog";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthStore } from "../../auth/data-access/auth.store";

export type CheckoutState = {
    selectedBillingAddress: ShippingAddress | undefined;
    selectedShippingAddress: ShippingAddress | undefined;
    loading: boolean,
}

const initialState: CheckoutState = {
    selectedBillingAddress: undefined,
    selectedShippingAddress: undefined,
    loading: false,
};

export const CheckoutStore = signalStore (
    { providedIn: 'root' },

    withState(initialState),

    withComputed((store, catalogStore = inject(CatalogStore), authStore = inject(AuthStore)) => ({
        cartItems: computed(() => catalogStore.cartItems()),
        user: computed(() => authStore.user())
    })),

    withMethods((store, catalogStore= inject(CatalogStore),  matDialog = inject(MatDialog), router = inject(Router), authStore = inject(AuthStore)) => ({
        
        setSelectedBillingAddress(address: any | undefined) {
            patchState(store, { selectedBillingAddress: address });
        },

        setSelectedShippingAddress(address: any | undefined) {
            patchState(store, { selectedShippingAddress: address });
        },


        clearCart: () => {
        catalogStore.clearCart();
      },

      proceedToCheckout: () => {
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
    })),
);