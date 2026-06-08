import { Component, OnInit } from '@angular/core';
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
  products: any[] = [];
  
  constructor(private productAPI: Product) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productAPI.getProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.products;
        }
      },
      error: (err) => console.error(err)
    });
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productAPI.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            this.loadProducts();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to delete product', 'error');
          }
        });
      }
    });
  }
}
