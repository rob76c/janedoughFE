import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { ShippingAddress } from "../../orders/model/order";
import { CartItem } from "../../catalog/model/cart-item";
import { loadCartFromStorage } from "../../cart/data-access/cart.service";
import { effect, inject } from "@angular/core";
import { User } from "../../auth/model/user";
import { loadUserFromStorage } from "../../auth/data-access/auth.service";
import { CatalogStore } from "../../catalog/data-access/catalog.store";

export type CheckoutState = {
    selectedAddress: ShippingAddress | undefined;
    cartItems: CartItem[];
    user: User | undefined;
    loading: boolean,
}

const initialState: CheckoutState = {
    selectedAddress: undefined,
    cartItems: loadCartFromStorage(),
    user: loadUserFromStorage(),
    loading: false,
};

export const CheckoutStore = signalStore (
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store, catalogStore= inject(CatalogStore)) => ({
        setSelectedAddress(address: any | undefined) {
            patchState(store, { selectedAddress: address });
        },
        clearCart: () => {
        catalogStore.clearCart();
      },
    })),

    withHooks({
    onInit(store) {
      effect(() => {
        localStorage.setItem('cartItems', JSON.stringify(store.cartItems()));
      });

    }
  })
);