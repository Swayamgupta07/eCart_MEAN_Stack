import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../services/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  
  isEditMode = signal(false);
  productId = signal<string | null>(null);

  constructor(
    private productAPI: Product,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.productId.set(id);
      
      // Reset form fields immediately so old details/images don't linger during loading
      this.productData.name = '';
      this.productData.description = '';
      this.productData.price = 0;
      this.productData.stock = 0;
      this.productData.category = '';
      this.productData.imageUrl = '';
      this.cdr.markForCheck();

      if (id) {
        this.isEditMode.set(true);
        this.productAPI.getProduct(id).subscribe({
          next: (res) => {
            if (res.success && res.product) {
              this.productData.name = res.product.name || '';
              this.productData.description = res.product.description || '';
              this.productData.price = res.product.price || 0;
              this.productData.stock = res.product.stock || 0;
              this.productData.category = res.product.category || '';
              this.productData.imageUrl = res.product.imageUrl || '';
            }
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to Load Product',
              text: 'Could not fetch product information from server.'
            });
            this.cdr.markForCheck();
          }
        });
      } else {
        this.isEditMode.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit() {
    const id = this.productId();
    if (this.isEditMode() && id) {
      this.productAPI.updateProduct(id, this.productData).subscribe({
        next: () => {
          Swal.fire('Updated!', 'Product updated successfully', 'success');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          const errMsg = err.error?.errors && Array.isArray(err.error.errors) ? err.error.errors.join(', ') : (err.error?.message || 'Failed to update');
          Swal.fire('Error', errMsg, 'error');
        }
      });
    } else {
      this.productAPI.addProduct(this.productData).subscribe({
        next: () => {
          Swal.fire('Added!', 'Product added successfully', 'success');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          const errMsg = err.error?.errors && Array.isArray(err.error.errors) ? err.error.errors.join(', ') : (err.error?.message || 'Failed to add');
          Swal.fire('Error', errMsg, 'error');
        }
      });
    }
  }
}
