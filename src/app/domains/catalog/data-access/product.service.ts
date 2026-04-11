import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponse } from '../model/product-response';
import { Product } from '../model/product';
import { environment } from '@/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private adminURL = `${environment.apiUrl}api/admin`
  private publicURL = `${environment.apiUrl}/api/public`

  http = inject(HttpClient);
  
  getAllProducts(pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'price', sortOrder: string = 'desc'): Observable<ProductResponse> {
    const params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize)
    .set('sortBy', sortBy)
    .set('sortOrder', sortOrder)
    return this.http.get<ProductResponse>(`${this.publicURL}/products`, {params});
  }

  getProductsByCategory(categoryId: number, pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'price', sortOrder: string = 'desc'): Observable<ProductResponse> {
    const params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize)
    .set('sortBy', sortBy)
    .set('sortOrder', sortOrder)
    return this.http.get<ProductResponse>(`${this.publicURL}/categories/${categoryId}/products`, {params});
  }
  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.publicURL}/products/${productId}`);
  }
}
