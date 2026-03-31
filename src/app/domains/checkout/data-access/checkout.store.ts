import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { ShippingAddress } from "../../orders/model/order";
import { CartItem } from "../../catalog/model/cart-item";
import { loadCartFromStorage } from "../../cart/data-access/cart.service";
import { effect, inject } from "@angular/core";
import { User } from "../../auth/model/user";
import { loadUserFromSession } from "../../auth/data-access/auth.service";
import { CatalogStore } from "../../catalog/data-access/catalog.store";
import { SignInDialog } from "../../auth/feature/sign-in-dialog/sign-in-dialog";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

export type CheckoutState = {
    selectedAddress: ShippingAddress | undefined;
    cartItems: CartItem[];
    user: User | undefined;
    loading: boolean,
}

const initialState: CheckoutState = {
    selectedAddress: undefined,
    cartItems: loadCartFromStorage(),
    user: loadUserFromSession(),
    loading: false,
};

export const CheckoutStore = signalStore (
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store, catalogStore= inject(CatalogStore),  matDialog = inject(MatDialog), router = inject(Router)) => ({
        
        setSelectedAddress(address: any | undefined) {
            patchState(store, { selectedAddress: address });
        },

        clearCart: () => {
        catalogStore.clearCart();
      },

      proceedToCheckout: () => {
        if (!store.user()) {
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

    withHooks({
    onInit(store) {
      effect(() => {
        localStorage.setItem('cartItems', JSON.stringify(store.cartItems()));
      });

      effect(() => {
        const user = store.user();
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      });

    }
  })
);