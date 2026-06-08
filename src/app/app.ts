import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Auth } from './services/auth';
import { CartService } from './services/cart';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(public authService: Auth, public cartService: CartService) {
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe();
    }
  }
  logout() {
    this.authService.logout();
    alert('Logged out successfully!');
  }
}
