import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  activeTab = signal<'login' | 'signup'>('login');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  switchTab(tab: 'login' | 'signup') {
    this.activeTab.set(tab);
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('Login successful');
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Credenciales incorrectas');
        }
      });
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: () => {
          console.log('Signup successful');
        },
        error: (err) => {
          console.error('Signup failed', err);
          alert('Error al registrar usuario');
        }
      });
    }
  }
}
