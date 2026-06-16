import { Component, OnInit, signal, untracked } from '@angular/core';
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
  cartItems = signal<any[]>([]);
  saveLaterItems = signal<any[]>([]);
  totalPrice = signal<number>(0);
  isLoading = signal<boolean>(true);
  couponCode = '';
  couponDiscount = signal<number>(0);
  couponApplied = signal<boolean>(false);

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
          const validItems = (res.cart.items || []).filter((item: any) => item && item.product);
          const validSaveLater = (res.cart.saveForLater || []).filter((item: any) => item && item.product);
          this.cartItems.set(validItems);
          this.saveLaterItems.set(validSaveLater);
          this.calculateTotal();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.isLoading.set(false);
      }
    });
  }

  calculateTotal() {
    const subtotal = this.cartItems().reduce((acc, item) => {
      const price = item && item.product ? (item.product.price || 0) : 0;
      const qty = item ? (item.quantity || 0) : 0;
      return acc + (price * qty);
    }, 0);
    this.totalPrice.set(Math.max(0, subtotal - this.couponDiscount()));
  }

  updateQuantity(item: any, change: number) {
    if (!item || !item.product) return;
    const newQty = (item.quantity || 0) + change;
    if (newQty <= 0) {
      this.removeItem(item.product._id);
      return;
    }

    if (change > 0 && newQty > (item.product.stock || 0)) {
      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock',
        text: `Sorry, only ${item.product.stock} units are available.`
      });
      return;
    }

    this.isLoading.set(true);
    this.cartService.addToCart(item.product._id, change).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadCart();
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
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
        this.isLoading.set(true);
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
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  saveForLater(productId: string) {
    this.isLoading.set(true);
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
        this.isLoading.set(false);
      }
    });
  }

  moveToCart(productId: string) {
    this.isLoading.set(true);
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
        this.isLoading.set(false);
      }
    });
  }

  applyCoupon() {
    if (this.couponCode.toUpperCase() === 'ECART15') {
      const subtotal = this.cartItems().reduce((acc, item) => {
        const price = item && item.product ? (item.product.price || 0) : 0;
        const qty = item ? (item.quantity || 0) : 0;
        return acc + (price * qty);
      }, 0);
      this.couponDiscount.set(subtotal * 0.15);
      this.couponApplied.set(true);
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
        this.cartItems.set([]);
        this.saveLaterItems.set([]);
        this.totalPrice.set(0);
        this.couponCode = '';
        this.couponDiscount.set(0);
        this.couponApplied.set(false);
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
