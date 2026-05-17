import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  isAuthenticated = signal<boolean>(false);
  isAuthModalOpen = signal<boolean>(false);
  currentUser = signal<any>(null);

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  register(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    this.isAuthenticated.set(true);
    this.currentUser.set(res.user);
    this.isAuthModalOpen.set(false);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  toggleModal() {
    this.isAuthModalOpen.set(!this.isAuthModalOpen());
  }

  closeModal() {
    this.isAuthModalOpen.set(false);
  }
}
