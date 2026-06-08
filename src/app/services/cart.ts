import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(res => {
        if (res.success && res.cart && res.cart.items) {
          const totalItems = res.cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
          this.cartCountSubject.next(totalItems);
        }
      })
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(this.apiUrl, { productId, quantity }).pipe(
      tap(res => {
        if (res.success && res.cart && res.cart.items) {
          const totalItems = res.cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
          this.cartCountSubject.next(totalItems);
        }
      })
    );
  }
}
