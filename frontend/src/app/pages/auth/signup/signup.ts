import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  userData = {
    name: '',
    email: '',
    password: '',
    role: 'customer'
  };
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'Registration successful. Please login now.',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message || 'Registration failed.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed. Try again later.';
      }
    });
  }
}
