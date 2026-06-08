import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product';
import { Cart } from '../../services/cart';
import { DiscountPipe } from '../../../core/discount.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DiscountPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: any[] = [];

  constructor(
    private productService: Product,
    private cartService: Cart
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.products;
        }
      },
      error: (err) => console.error(err)
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product._id).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${product.name} has been added to your cart.`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please login to add items to cart!'
        });
      }
    });
  }
}
