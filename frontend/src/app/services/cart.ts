import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  public cartCount = signal<number>(0);
  public saveLaterCount = signal<number>(0);
  public cartItems = signal<any[]>([]);
  public saveLaterItems = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  private updateCartState(res: any) {
    if (res.success && res.cart) {
      const items = res.cart.items || [];
      const saveLater = res.cart.saveForLater || [];
      this.cartItems.set(items);
      this.saveLaterItems.set(saveLater);
      const totalItems = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      this.cartCount.set(totalItems);
      this.saveLaterCount.set(saveLater.length);
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
    this.cartItems.set([]);
    this.saveLaterItems.set([]);
    this.cartCount.set(0);
    this.saveLaterCount.set(0);
  }
}
