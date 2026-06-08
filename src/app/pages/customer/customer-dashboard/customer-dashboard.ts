import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order} from '../../../services/order';
import Swal from 'sweetalert2';
import { Cart } from '../../../services/cart';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css',
})
export class CustomerDashboard implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: Cart, private orderService: Order) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res.success && res.cart) {
          this.cartItems = res.cart.items;
          this.calculateTotal();
        }
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      }
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
  }

  checkout() {
    this.orderService.checkout().subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been successfully placed.',
          timer: 2000,
          showConfirmButton: false
        });

        this.cartItems = [];
        this.totalPrice = 0;
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
