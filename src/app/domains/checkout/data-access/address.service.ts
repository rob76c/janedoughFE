import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ShippingAddress } from '../../orders/model/order';
import { Observable } from 'rxjs';
import { environment } from '@/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private url = `${environment.apiUrl}/api`

  http = inject(HttpClient);
  
  createAddress(address: ShippingAddress): Observable<ShippingAddress> {
    return this.http.post<ShippingAddress>(`${this.url}/addresses`, address, {withCredentials:true});
  }

  getAddressById(addressId: String): Observable<ShippingAddress> {
    return this.http.get<ShippingAddress>(`${this.url}/addresses/${addressId}`, {withCredentials:true});
  }

  getUserAddresses(): Observable<ShippingAddress[]> {
    return this.http.get<ShippingAddress[]>(`${this.url}/user/addresses`, {withCredentials:true});
  }
  updateAddress(address: ShippingAddress, addressId: String): Observable<ShippingAddress> {
    return this.http.put<ShippingAddress>(`${this.url}/addresses/${addressId}`, address, {withCredentials:true});
  }

  deleteAddress(addressId: String){
    return this.http.delete(`${this.url}/addresses/${addressId}`, {withCredentials:true, responseType: 'text'});
  }
}
