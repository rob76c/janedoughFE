import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { SignInParams, SignInResponse, SignUpParams, User } from "../model/user";
import { AuthService, loadSessionFromStorage, loadUserFromSession } from "./auth.service";
import { firstValueFrom } from "rxjs";
import { computed, effect, inject } from "@angular/core";
import { Toaster } from "@/src/app/core/notification/toaster.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CartService, loadCartFromStorage } from "../../cart/data-access/cart.service";
import { CartItem } from "../../catalog/model/cart-item";
import { SignInDialog } from "../feature/sign-in-dialog/sign-in-dialog";
import { CatalogStore } from "../../catalog/data-access/catalog.store";


export type AuthState = {
    user: User | undefined;
    authSession: SignInResponse | undefined;
    loading: boolean;
};

const initialState: AuthState = {
  user: loadUserFromSession(),            
  authSession: loadSessionFromStorage(),
  loading: false,
};

export const AuthStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withComputed((store, catalogStore = inject(CatalogStore)) => ({
        cartItems: computed(() => catalogStore.cartItems())
    })),

    withMethods((store, toaster = inject(Toaster), matDialog = inject(MatDialog), router = inject(Router), authService = inject(AuthService), cartService = inject(CartService), catalogStore= inject(CatalogStore)) => ({
        
        setUser: (user: User | undefined) => {
        patchState(store, { user });
      },

        signIn: async ({ email, password, checkout, dialogId }: SignInParams) => {
        patchState(store, {loading:true});

        try {
          const response = await firstValueFrom(authService.signIn({email, password}));

          const user: User = {
            userId: response.id,
            username: response.username,
            email: response.email || email,
            jwtToken: response.jwtToken,
            phoneNumber: response.phoneNumber || '',
            roles: response.roles,
          };

          let fetchedCartItems: CartItem[] = [];
          try {
            const cart = await firstValueFrom(cartService.getCartByCurentUser());
            if (cart) {
              fetchedCartItems = cart.items.map((item: any) => ({
                quantity: item.quantity,
                product: {
                  productId: item.productId,
                  productName: item.productName,
                  stock: item.stock,
                  price: item.price,
                  discount: item.discount,
                  specialPrice: item.specialPrice,
                }
              }));
            }
          } catch (cartError) {
            console.error('Failed to fetch user cart upon sign in', cartError);
          }

          patchState(store, {user, loading: false});
          catalogStore.setCartItems(fetchedCartItems);
          toaster.success(`Welcome, ${user.username}`);

          matDialog.getDialogById(dialogId)?.close();

        if (checkout) {
          router.navigate(['/checkout']);
        }
        } catch (error: any) {
          console.error('Login Error: ', error);
          const errorMessage = error.error?.message || 'Invalid Credentials';
          toaster.error(errorMessage);
          patchState(store, {loading: false});
        }
      },

      signOut: async () => {
        patchState(store, { loading:true});
        try{
            const response = await firstValueFrom(authService.signOut());
            patchState(store, {user: undefined,loading:false});
            catalogStore.clearCart();
            toaster.success('Successfully Signed Out!')
            router.navigate(['/']);

        } catch (error: any) {
          console.error('Logout Error: ', error);
          const errorMessage = error.error?.message || 'Logout Error';
          toaster.error(errorMessage);
          patchState(store, {user: undefined, loading:false});
        }
      },

      signUp: async ({
        username,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        password,
        socialMediaHandle,
        checkout,
        dialogId,
      }: SignUpParams) => {
        patchState(store, {loading: true});

        try {
          await firstValueFrom(
            authService.signUp(
              username,
              firstName,
              middleName,
              lastName,
              email,
        phoneNumber,
        password,
        socialMediaHandle
            )
          );
          toaster.success('Account Created successfully! Please sign in!');
          matDialog.getDialogById(dialogId)?.close();
          matDialog.open(SignInDialog, {
            disableClose: true,
            data: {checkout},
          });
        } catch(error: any) {
          console.error(error);
          toaster.error(error.error?.message || 'Registration Failed');
        } finally {
          patchState(store, {loading: false});
        }
      },
    })
  ),

  withHooks({
    onInit(store) {
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

)

