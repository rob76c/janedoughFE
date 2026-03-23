import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../model/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private url = 'http://localhost:8080/api/carts'

  http = inject(HttpClient);

  
  addProductToCart(productId: string, quantity: string): Observable<Cart> {
    return this.http.post<Cart>(`${this.url}/products/${productId}/quantity/${quantity}`, {productId, quantity}, {withCredentials:true})
  }

  updateProductfromCart(productId: string, operation: string): Observable<Cart> {
    return this.http.put<Cart>(`${this.url}/products/${productId}/quantity/${operation}`, {productId, operation}, {withCredentials:true})
  }

  getCartByCurentUser(): Observable<Cart> {
    return this.http.get<Cart>(`${this.url}/user/cart`, {withCredentials:true})
  }
  
  deleteProductFromCart(cartId: string, productId: string) {
    return this.http.delete(`${this.url}/${cartId}/product/${productId}`, {withCredentials:true, responseType: 'text'});
  }
}
