import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { email: '', password: '' };
  errorMessage = signal('');

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            text: 'Login Successful',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/home']);
        } else {
          this.errorMessage.set(response.message || 'Sorry, login failed. Please check your credentials.');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage.set(err.error?.message || 'An error occurred during login. Please try again later.');
      }
    });
  }
}
