import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../services/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  productData = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: ''
  };
  
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private productAPI: Product,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productAPI.getProduct(this.productId).subscribe({
        next: (res) => {
          if (res.success) {
            this.productData = res.product;
          }
        }
      });
    }
  }

  onSubmit() {
    if (this.isEditMode && this.productId) {
      this.productAPI.updateProduct(this.productId, this.productData).subscribe({
        next: () => {
          Swal.fire('Updated!', 'Product updated successfully', 'success');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => Swal.fire('Error', err.error.message || 'Failed to update', 'error')
      });
    } else {
      this.productAPI.addProduct(this.productData).subscribe({
        next: () => {
          Swal.fire('Added!', 'Product added successfully', 'success');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => Swal.fire('Error', err.error.message || 'Failed to add', 'error')
      });
    }
  }
}
