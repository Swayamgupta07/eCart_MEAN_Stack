import { Component, signal } from '@angular/core';
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
  errorMessage = signal('');

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
          this.errorMessage.set(response.message || 'Registration failed.');
        }
      },
      error: (err) => {
        console.error(err);
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.errorMessage.set(err.error.errors.join(', '));
        } else {
          this.errorMessage.set(err.error?.message || 'Registration failed. Try again later.');
        }
      }
    });
  }
}
