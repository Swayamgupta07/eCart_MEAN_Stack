import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private apiUrl = 'http://localhost:3000/cart';
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  private saveLaterCountSubject = new BehaviorSubject<number>(0);
  public saveLaterCount$ = this.saveLaterCountSubject.asObservable();

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private saveLaterItemsSubject = new BehaviorSubject<any[]>([]);
  public saveLaterItems$ = this.saveLaterItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private updateCartState(res: any) {
    if (res.success && res.cart) {
      const items = res.cart.items || [];
      const saveLater = res.cart.saveForLater || [];
      this.cartItemsSubject.next(items);
      this.saveLaterItemsSubject.next(saveLater);
      const totalItems = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      this.cartCountSubject.next(totalItems);
      this.saveLaterCountSubject.next(saveLater.length);
    }
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(res => this.updateCartState(res))
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap(res => this.updateCartState(res))
    );
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(res => this.updateCartState(res))
    );
  }

  saveForLater(productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save-later/${productId}`, {}).pipe(
      tap(res => this.updateCartState(res))
    );
  }

  moveToCart(productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/move-to-cart/${productId}`, {}).pipe(
      tap(res => this.updateCartState(res))
    );
  }

  resetCounts() {
    this.cartItemsSubject.next([]);
    this.saveLaterItemsSubject.next([]);
    this.cartCountSubject.next(0);
    this.saveLaterCountSubject.next(0);
  }
}

