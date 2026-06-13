import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from './services/auth';
import { Cart } from './services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;

  constructor(public authService: Auth, public cartService: Cart) {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.role === 'customer') {
        this.cartService.getCart().subscribe({
          error: (err) => console.error(err)
        });
      } else {
        this.cartService.resetCounts();
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeMenus() {
    this.isMobileMenuOpen = false;
    this.isProfileDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenus();
  }
}
