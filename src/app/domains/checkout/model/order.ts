import { CartItem } from "../../catalog/model/cart-item";

export type Order = {
    orderId: string;
    email: string;
    phoneNumber: string;
    orderItems: CartItem[];
    orderDateTime: Date;
    payment: string;
    totalPrice: number;
    orderStatus: string;
}