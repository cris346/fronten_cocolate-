import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  fb = inject(FormBuilder);
  router = inject(Router);

  showSuccessModal = signal<boolean>(false);

  addressForm = this.fb.group({
    calleNumero: ['', Validators.required],
    colonia: ['', Validators.required],
    codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
    ciudad: ['', Validators.required],
    estado: ['', Validators.required]
  });

  processOrder() {
    if (this.addressForm.valid && this.cartService.cartItems().length > 0) {
      this.cartService.placeOrder(this.addressForm.value).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          this.showSuccessModal.set(true);
          this.cartService.clearCart();
        },
        error: (err) => {
          console.error('Error creating order:', err);
          alert('Hubo un error al procesar el pedido. Intenta de nuevo.');
        }
      });
    }
  }

  closeModal() {
    this.showSuccessModal.set(false);
    this.router.navigate(['/']);
  }
}
