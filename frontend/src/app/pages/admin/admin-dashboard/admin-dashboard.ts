import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../../services/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  products = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private productAPI: Product) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productAPI.getProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.products.set(res.products || []);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: 'Delete Product?',
      text: 'Are you sure you want to remove this product from the inventory? This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading.set(true);
        this.productAPI.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            this.loadProducts();
          },
          error: (err) => {
            console.error(err);
            this.isLoading.set(false);
            Swal.fire('Error', 'Failed to delete product', 'error');
          }
        });
      }
    });
  }
}
