import { computed, inject } from "@angular/core";
import { Product } from "../model/product";
import {patchState, signalMethod, signalStore, withComputed, withMethods, withState} from '@ngrx/signals'
import {produce} from 'immer';
import { Toaster } from "@/src/app/core/notification/toaster.service";
import { CartItem } from "../model/cart-item";

export type CatalogState = {
    products: Product[];
    selectedCategory: string;
    wishlistItems: Product[];
    cartItems: CartItem[];
};

export const CatalogStore = signalStore(
    {
        providedIn: 'root'
    },
    withState({
        products: [
            {
      productId: 'CK001',
      productName: 'Classic Chocolate Chip Cookie',
      image: 'assets/imgs/chocolatecookie.jpg',
      description: 'A soft and chewy classic cookie loaded with rich chocolate chips.',
      stock: 120,
      price: 2.5,
      discount: 10,
      specialPrice: 2.25,
      category: 'Cookies',
    },
    {
      productId: 'CK002',
      productName: 'Double Chocolate Cookie',
      image: 'assets/imgs/doubleChocolateChunk.png',
      description: 'A decadent chocolate cookie with extra chocolate chunks.',
      stock: 90,
      price: 2.75,
      discount: 15,
      specialPrice: 2.34,
      category: 'Cookies',
    },
    {
      productId: 'CK003',
      productName: 'Oatmeal Raisin Cookie',
      image: 'assets/imgs/oatmealRaisin.png',
      description: 'A wholesome oatmeal cookie with sweet raisins and a hint of cinnamon.',
      stock: 100,
      price: 2.25,
      discount: 5,
      specialPrice: 2.14,
      category: 'Cookies',
    },
    {
      productId: 'CK004',
      productName: 'Peanut Butter Smores Cookie',
      image: 'assets/imgs/PBsmores.png',
      description: 'A creamy peanut butter cookie with a soft center and crisp edges.',
      stock: 80,
      price: 2.6,
      discount: 0,
      specialPrice: 2.6,
      category: 'Cookies',
    },
    {
      productId: 'CK005',
      productName: 'White Chocolate Macadamia Cookie',
      image: 'assets/imgs/whitechocolate.png',
      description: 'A buttery cookie packed with white chocolate chips and macadamia nuts.',
      stock: 70,
      price: 3.0,
      discount: 20,
      specialPrice: 2.4,
      category: 'Cookies',
    },
    {
      productId: 'CK006',
      productName: 'Sugar Cookie',
      image: 'assets/imgs/sugarcookie.jpg',
      description: 'A simple, sweet sugar cookie with a soft texture and light vanilla flavor.',
      stock: 150,
      price: 2.0,
      discount: 5,
      specialPrice: 1.9,
      category: 'Cookies',
    }
        ],
        selectedCategory: 'all',
        wishlistItems: [],
        cartItems: []
    }as CatalogState),
    withComputed(({selectedCategory, products, wishlistItems, cartItems}) => ({
        filteredProducts:  computed(() => {
    if (selectedCategory() === 'all') return products();
    return products().filter(
      (p) => p.category.toLowerCase() === selectedCategory().toLowerCase()
    );
  }),
    wishlistCount: computed(() => wishlistItems().length),
    cartCount: computed(() => cartItems().reduce((acc, item) => acc + item.quantity, 0))
    })),

    withMethods((store, toaster = inject(Toaster)) => ({
        setCategory: signalMethod<string>((category:string) => {
            patchState(store,{selectedCategory: category});
        }),

        addToWishlist: (product:Product) => {
            const updatedWishListItems = produce(store.wishlistItems(), (draft) => {
                if(!draft.find(p => p.productId === product.productId)) {
                    draft.push(product);
                }
            });
            patchState(store, {wishlistItems:updatedWishListItems});
            toaster.success('Product added to wishlist');
        },
        removeFromWishlist: (product: Product) => {
            patchState(store, {wishlistItems: store.wishlistItems().filter((p) => p.productId !== product.productId),   
            });
        },
        clearWishlist: () => {
            patchState(store, {wishlistItems: []});
        },

        addToCart: (product: Product, quantity =1) => {
            const existingItemIndex = store.cartItems().findIndex(i=> i.product.productId === product.productId);
            
            const updatedCartItems = produce(store.cartItems(), (draft) => {
                if (existingItemIndex !== -1) {
                    draft[existingItemIndex].quantity += quantity;
                    return;
                }
                draft.push({
                    product, quantity
                })
            });
            patchState(store, {cartItems: updatedCartItems})
            toaster.success(existingItemIndex !== -1 ? 'Product added to cart again!' : 'Product added to cart')
        },

        setItemQuantity(params: {productId: string, quantity: number}) {
            const index = store.cartItems().findIndex(c => c.product.productId === params.productId);
            const updated = produce(store.cartItems(), (draft) => {
                draft[index].quantity = params.quantity
            });
            patchState(store, {cartItems: updated});
        },

        addAllWishlistToCart: () => {
            const updatedCartItems = produce(store.cartItems(), (draft) =>
                store.wishlistItems().forEach(p => {
                    if (!draft.find(c => c.product.productId === p.productId)) {
                        draft.push({product: p, quantity: 1})
                    }
                })
            )
            patchState(store, {cartItems: updatedCartItems, wishlistItems: []});
        },

        moveToWishlist: (product: Product) => {
            const updatedCartItems = store.cartItems().filter((p => p.product.productId !== product.productId));
            const updatedWishListItems = produce(store.wishlistItems(), (draft) => {
                if(!draft.find(p => p.productId === product.productId)) {
                    draft.push(product);
                }
            })
            patchState(store, { cartItems: updatedCartItems, wishlistItems: updatedWishListItems});
        },

        removeFromCart: (product: Product) => {
            patchState(store, {cartItems: store.cartItems().filter((c => c.product.productId !== product.productId))});
        }
    }))
);