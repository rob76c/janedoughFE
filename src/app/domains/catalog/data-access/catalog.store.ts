import { computed, effect, inject } from '@angular/core';
import { Product } from '../model/product';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { produce } from 'immer';
import { Toaster } from '@/src/app/core/notification/toaster.service';
import { CartItem } from '../model/cart-item';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialog } from '../../auth/feature/sign-in-dialog/sign-in-dialog';
import { SignInParams, SignUpParams, User } from '../../auth/model/user';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from './product.service';
import { catchError, firstValueFrom, map, of, startWith, switchMap } from 'rxjs';
import { AuthService, loadUserFromStorage } from '../../auth/data-access/auth.service';
import { CartService, loadCartFromStorage } from '../../cart/data-access/cart.service';
import { ShippingAddress } from '../../orders/model/order';

//add angulararchitects/ngrxtoolkit and add withStorageSync() to keep data when browser refresh

export type CatalogState = {
  selectedCategoryId: string;
  wishlistItems: Product[];
  cartItems: CartItem[];
  user: User | undefined;

  loading: boolean;
  selectedProductId: string | undefined;

  selectedAddress: ShippingAddress | undefined;
};

const initialState: CatalogState = {
  selectedCategoryId: 'all',
  wishlistItems: [],
  cartItems: loadCartFromStorage(),
  user: loadUserFromStorage(),
  loading: false,
  selectedProductId: undefined,
  selectedAddress: undefined,
};

export const CatalogStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withComputed((store) => {
    const productService = inject(ProductService);
    const category$ = toObservable(store.selectedCategoryId);
    const selectedProductId$ = toObservable(store.selectedProductId);

    const productsSource$ = category$.pipe(
      switchMap((category) => {
        const apiCall$ =
          category === 'all'
            ? productService.getAllProducts(0, 10)
            : productService.getProductsByCategory(Number(category), 0, 10);

        return apiCall$.pipe(
          map((response) => ({ isLoading: false, data: response.content })),
          startWith({ isLoading: true, data: [] as Product[] }),
          catchError((err) => {
            console.error(err);
            return of({ isLoading: false, data: [] as Product[] });
          })
        );
      })
    );
    const productState = toSignal(productsSource$, {
      initialValue: { isLoading: true, data: [] as Product[] },
    });

    const productDetailsSource$ = selectedProductId$.pipe(
      switchMap((id) => {
        if (!id) return of({ isLoading: false, data: undefined });
        return productService.getProductById(id).pipe(
          map((product) => ({ isLoading: false, data: product })),
          startWith({ isLoading: false, data: undefined }),
          catchError((err) => {
            console.error('Error loading product details:', err);
            return of({ isLoading: false, data: undefined });
          })
        );
      })
    );

    const selectedProductState = toSignal(productDetailsSource$, {
      initialValue: { isLoading: false, data: undefined },
    });
    return {
      products: computed(() => productState().data),
      productsLoading: computed(() => productState().isLoading),
      selectedProduct: computed(() => selectedProductState().data),
      selectedProductLoading: computed(() => selectedProductState().isLoading),
    };
  }),

  withComputed(({ products, wishlistItems, cartItems, selectedProductId }) => ({
    filteredProducts: computed(() => products()),
    wishlistCount: computed(() => wishlistItems().length),
    cartCount: computed(() => cartItems().reduce((acc, item) => acc + item.quantity, 0)),
  })),

  withMethods(
    (store, toaster = inject(Toaster), matDialog = inject(MatDialog), router = inject(Router), authService = inject(AuthService), cartService = inject(CartService)) => ({
      setCategory: signalMethod<string>((categoryId: string) => {
        patchState(store, { selectedCategoryId: categoryId });
      }),
      setProductId: signalMethod<string>((productId: string) => {
        patchState(store, { selectedProductId: productId });
      }),

      addToWishlist: (product: Product) => {
        const updatedWishListItems = produce(store.wishlistItems(), (draft) => {
          if (!draft.find((p) => p.productId === product.productId)) {
            draft.push(product);
          }
        });
        patchState(store, { wishlistItems: updatedWishListItems });
        toaster.success('Product added to wishlist');
      },
      removeFromWishlist: (product: Product) => {
        patchState(store, {
          wishlistItems: store.wishlistItems().filter((p) => p.productId !== product.productId),
        });
      },
      clearWishlist: () => {
        patchState(store, { wishlistItems: [] });
      },

      clearCart: () => {
        patchState(store, { cartItems: [] });
      },

      setSelectedAddress: signalMethod<any>((address: any) => {
      patchState(store, { selectedAddress: address });
    }),


      addToCart: async (product: Product, quantity = 1) => {
        patchState(store, {loading: true});
        try {
          await firstValueFrom(cartService.addProductToCart(product.productId, quantity.toString()));
        
        const existingItemIndex = store
          .cartItems()
          .findIndex((i) => i.product.productId === product.productId);

        const updatedCartItems = produce(store.cartItems(), (draft) => {
          if (existingItemIndex !== -1) {
            draft[existingItemIndex].quantity += quantity;
            return;
          }
          draft.push({
            product,
            quantity,
          });
        });
        patchState(store, { cartItems: updatedCartItems });
        toaster.success(
          existingItemIndex !== -1 ? 'Product added to cart again!' : 'Product added to cart'
        );
      } catch (error:any) {
        console.error('Add to Cart Error', error);
        patchState(store,{loading:false});
        if(error.status === 401) {
          toaster.error('Please sign in to add items to your cart');
          matDialog.open(SignInDialog, {disableClose:true});
        } else {
          toaster.error('Failed to add product to cart');
        }
      }
      },

      setItemQuantity: async(params: { productId: string; quantity: number }) => {
        const index = store.cartItems().findIndex((c) => c.product.productId === params.productId);
        if (index === -1) return;

        const currentQty = store.cartItems()[index].quantity;
        const newQty = params.quantity;

        const operation = newQty < currentQty ? 'delete': 'add';
        patchState(store, {loading:true});
        try{
          await firstValueFrom(cartService.updateProductfromCart(params.productId, operation));
          
          const updated = produce(store.cartItems(), (draft) => {
          draft[index].quantity = newQty;
        });
        patchState(store, { cartItems: updated, loading:false });
        } catch (error) {
          console.error('Update Quantity Error', error);
            toaster.error('Failed to update quantity');
            patchState(store, { loading: false });
        }
      
      },

      addAllWishlistToCart: () => {
        const updatedCartItems = produce(store.cartItems(), (draft) =>
          store.wishlistItems().forEach((p) => {
            if (!draft.find((c) => c.product.productId === p.productId)) {
              draft.push({ product: p, quantity: 1 });
            }
          })
        );
        patchState(store, { cartItems: updatedCartItems, wishlistItems: [] });
      },

      moveToWishlist: (product: Product) => {
        const updatedCartItems = store
          .cartItems()
          .filter((p) => p.product.productId !== product.productId);
        const updatedWishListItems = produce(store.wishlistItems(), (draft) => {
          if (!draft.find((p) => p.productId === product.productId)) {
            draft.push(product);
          }
        });
        patchState(store, { cartItems: updatedCartItems, wishlistItems: updatedWishListItems });
      },

      removeFromCart: async (product: Product) => {
        patchState(store, {loading: true});
        try {
          const cart = await firstValueFrom(cartService.getCartByCurentUser());
          if (cart && cart.cartId) {
            await firstValueFrom(cartService.deleteProductFromCart(cart.cartId.toString(), product.productId.toString()));
            patchState(store, {
          cartItems: store.cartItems().filter((c) => c.product.productId !== product.productId),
          loading:false
        });
        toaster.success('Item removed from cart!')
          }
        } catch (error: any) {
          console.error('Remove from cart error', error);
          patchState(store, {loading:false});
          toaster.error('Failed to remove item from cart')
        }
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

      

      signIn: async ({ email, password, checkout, dialogId }: SignInParams) => {
        patchState(store, {loading:true});

        try {
          const response = await firstValueFrom(authService.signIn({email, password}));

          const user: User = {
            userId: response.userId,
            username: response.username,
            email: response.email || email,
            firstName: response.firstName || '',
            middleName: response.middleName || '',
            lastName: response.lastName || '',
            phoneNumber: response.phoneNumber || '',
            socialMediaHandle: response.socialMediaHandle || '',
            password: '',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + response.username
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

          patchState(store, {user, cartItems: fetchedCartItems, loading: false});
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
            patchState(store, {user: undefined, cartItems: [],loading:false});
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
