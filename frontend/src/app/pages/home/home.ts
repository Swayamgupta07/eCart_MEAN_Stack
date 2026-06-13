import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product';
import { Cart } from '../../services/cart';
import { Auth } from '../../services/auth';
import { DiscountPipe } from '../../core/discount.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DiscountPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: any[] = [];
  isLoading = true;
  savedProductIds: Set<string> = new Set();

  constructor(
    private productService: Product,
    private cartService: Cart,
    public authService: Auth
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.products;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

    this.cartService.saveLaterItems$.subscribe(items => {
      this.savedProductIds = new Set(items.map(item => item.product._id));
    });
  }

  addToCart(product: any) {
    if (this.authService.getRole() === 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Admins are not allowed to add products to cart.'
      });
      return;
    }

    this.cartService.addToCart(product._id).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${product.name} has been added to your cart.`,
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Something went wrong!';
        if (err.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please sign in to add products to your cart.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Add Item',
            text: errorMsg
          });
        }
      }
    });
  }

  toggleSaveForLater(product: any) {
    if (this.authService.getRole() === 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Admins are not allowed to save products.'
      });
      return;
    }

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please sign in to save products for later.'
      });
      return;
    }

    if (this.savedProductIds.has(product._id)) {
      this.cartService.removeFromCart(product._id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Removed',
            text: `${product.name} removed from Saved Items.`,
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Could not remove item.'
          });
        }
      });
    } else {
      this.cartService.saveForLater(product._id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: `${product.name} saved for later.`,
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Could not save item.'
          });
        }
      });
    }
  }
}
