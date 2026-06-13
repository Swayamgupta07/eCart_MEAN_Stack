import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for reaching out. We will get back to you shortly.',
      timer: 2500,
      showConfirmButton: false
    });
    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
