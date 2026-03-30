import { CartItem } from "../../catalog/model/cart-item";

export type Cart = {
    cartId: number;
    items: CartItem[];
    totalPrice: number;
}