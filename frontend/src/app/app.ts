import { Component, signal, effect, untracked } from '@angular/core';
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
  isMobileMenuOpen = signal(false);
  isProfileDropdownOpen = signal(false);

  constructor(public authService: Auth, public cartService: Cart) {
    effect(() => {
      const user = this.authService.currentUser();
      untracked(() => {
        if (user && user.role === 'customer') {
          this.cartService.getCart().subscribe({
            error: (err) => console.error(err)
          });
        } else {
          this.cartService.resetCounts();
        }
      });
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen.update(v => !v);
  }

  closeMenus() {
    this.isMobileMenuOpen.set(false);
    this.isProfileDropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMenus();
  }
}
