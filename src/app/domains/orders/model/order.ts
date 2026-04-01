import { z } from 'zod';
import { CartItem } from '../../catalog/model/cart-item';

export const ShippingAddressSchema = z.object({
  addressId: z.number(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  street: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const orderRequestSchema = z.object({
  addressId: z.number(),
  paymentMethod: z.string(),
  pgName: z.string(),
  pgPaymentId: z.string(),
  pgStatus: z.string(),
  pgResponseMessage: z.string(),
})

export const OrderSchema = z.object({
  orderId: z.string(),
  email: z.email(),
  phoneNumber: z.number(),
  orderItems: z.array(
    z.object({
      orderItemId: z.string(),
      product: z.object({
        productId: z.string(),
        productName: z.string(),
        image: z.string(),
        description: z.string(),
        stock: z.number(),
        price: z.number(),
        discount: z.number(),
        specialPrice: z.number(),
      }),
      quantity: z.number(),
      orderedProductPrice: z.number(),
      discount: z.number(),
    })
  ),
  orderDateTime: z.custom<{ toDate: () => Date }>().transform((ts) => ts.toDate()),
  payment: z.object({
    paymentId: z.string(),
    paymentMethod: z.string(),
    pgPaymentId: z.string(),
    pgStatus: z.string(),
    pgResponseMessage: z.string(),
    pgName: z.string(),
  }),
  totalPrice: z.number(),
  orderStatus: z.string(),
  addressId: z.number(),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type Order = z.infer<typeof OrderSchema>;

export type OrderRequest = z.infer<typeof orderRequestSchema>;

// export type OrderSummary = {
//     orderId: string;
//     email: string;
//     phoneNumber: string;
//     orderItems: CartItem[];
//     orderDateTime: Date;
//     payment: string;
//     totalPrice: number;
//     orderStatus: string;
// }
export interface OrderResponse {
  content: Order[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

