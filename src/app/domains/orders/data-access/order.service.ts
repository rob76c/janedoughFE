import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url = 'http://localhost:8080/api/order'

  http = inject(HttpClient);
  
  orderCompleted(paymentMethod: string, orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.url}/users/payments/${paymentMethod}`, orderRequest, {withCredentials:true});
  }
}
