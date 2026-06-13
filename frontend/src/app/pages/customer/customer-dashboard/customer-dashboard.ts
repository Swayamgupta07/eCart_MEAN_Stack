import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Order } from '../../../services/order';
import { Cart } from '../../../services/cart';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
})
export class CustomerDashboard implements OnInit {
  cartItems: any[] = [];
  saveLaterItems: any[] = [];
  totalPrice: number = 0;
  isLoading = true;
  couponCode = '';
  couponDiscount = 0;
  couponApplied = false;

  constructor(
    private cartService: Cart,
    private orderService: Order,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCart();
    this.route.fragment.subscribe(frag => {
      if (frag === 'save-for-later') {
        setTimeout(() => {
          const element = document.getElementById('save-for-later-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    });
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res.success && res.cart) {
          this.cartItems = res.cart.items || [];
          this.saveLaterItems = res.cart.saveForLater || [];
          this.calculateTotal();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.isLoading = false;
      }
    });
  }

  calculateTotal() {
    const subtotal = this.cartItems.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
    this.totalPrice = Math.max(0, subtotal - this.couponDiscount);
  }

  updateQuantity(item: any, change: number) {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      this.removeItem(item.product._id);
      return;
    }

    if (change > 0 && newQty > item.product.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock',
        text: `Sorry, only ${item.product.stock} units are available.`
      });
      return;
    }

    this.isLoading = true;
    this.cartService.addToCart(item.product._id, change).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadCart();
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  removeItem(productId: string) {
    Swal.fire({
      title: 'Remove Item?',
      text: 'Do you want to remove this item from your cart?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.cartService.removeFromCart(productId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Removed',
              text: 'Item has been removed from your cart.',
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
            this.loadCart();
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  saveForLater(productId: string) {
    this.isLoading = true;
    this.cartService.saveForLater(productId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: 'Item moved to Save for Later.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.loadCart();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  moveToCart(productId: string) {
    this.isLoading = true;
    this.cartService.moveToCart(productId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Moved to Cart',
          text: 'Item moved to active shopping cart.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        this.loadCart();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  applyCoupon() {
    if (this.couponCode.toUpperCase() === 'ECART15') {
      const subtotal = this.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      this.couponDiscount = subtotal * 0.15;
      this.couponApplied = true;
      this.calculateTotal();
      Swal.fire({
        icon: 'success',
        title: 'Coupon Applied!',
        text: 'You have received a 15% discount.',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Coupon',
        text: 'Please check your code. Try ECART15.'
      });
    }
  }

  checkout() {
    this.orderService.checkout().subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your fresh grocery order has been successfully placed.',
          timer: 2000,
          showConfirmButton: false
        });
        this.cartItems = [];
        this.saveLaterItems = [];
        this.totalPrice = 0;
        this.couponCode = '';
        this.couponDiscount = 0;
        this.couponApplied = false;
        this.cartService.getCart().subscribe();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Checkout Failed',
          text: err.error.message || 'Something went wrong!'
        });
      }
    });
  }
}
