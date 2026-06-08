import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,tap } from 'rxjs'; // BehaviorSubject: A reactive data stream that always holds a "current value".It instantly broadcasts this value (e.g., the user's login status) to any component that subscribes to it, allowing our UI to update dynamically without requiring a page reload.
import { email } from '@angular/forms/signals';
//tap: An RxJS operator used to perform "side effects" (like saving data to LocalStorage) by looking at the data stream as it passes through, without altering the actual data before it reaches the component.
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null); // This creates a new BehaviorSubject that starts with a value of null, indicating that no user is currently logged in. Components can subscribe to this subject to get real-time updates on the user's authentication status.
  public currentUser$ = this.currentUserSubject.asObservable(); // This exposes the currentUserSubject as an Observable, allowing components to subscribe to it and react to changes in the user's authentication status.

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser'); // This line checks if there's a user object stored in the browser's LocalStorage (which would indicate that the user is already logged in from a previous session).
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}
