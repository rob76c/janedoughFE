import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderRequest, OrderResponse } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url = 'http://localhost:8080/api'

  http = inject(HttpClient);
  
  orderCompleted(paymentMethod: string, orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.url}/order/users/payments/${paymentMethod}`, orderRequest, {withCredentials:true});
  }

  getAllUserOrders(pageNumber: number = 0, pageSize: number = 10, sortBy: string = 'totalPrice', sortOrder: string = 'desc'): Observable<OrderResponse> {
    const params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString())
    .set('sortBy', sortBy)
    .set('sortOrder', sortOrder)
      return this.http.get<OrderResponse>(`${this.url}/user/orders`, {params, withCredentials:true})
    }
}
