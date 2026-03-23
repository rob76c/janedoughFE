import { CartItem } from "../../catalog/model/cart-item";

export type Cart = {
    cartId: number;
    cartItems: CartItem[];
    totalPrice: number;
}