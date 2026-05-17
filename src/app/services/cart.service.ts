import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ChocolateSelection {
  baseFlavor: string;
  filling: string;
}

export interface CartItem {
  id: string;
  boxSize: 'Chica' | 'Grande';
  chocolates: ChocolateSelection[];
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private cartItemsSignal = signal<CartItem[]>([]);

  cartItems = this.cartItemsSignal.asReadonly();
  cartTotal = computed(() => this.cartItemsSignal().reduce((total, item) => total + (item.price * item.quantity), 0));
  cartCount = computed(() => this.cartItemsSignal().reduce((count, item) => count + item.quantity, 0));
  isCartOpen = signal<boolean>(false);

  toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
  }

  addToCart(item: Omit<CartItem, 'id'>) {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9)
    };
    this.cartItemsSignal.update(items => [...items, newItem]);
    this.isCartOpen.set(true);
  }

  removeFromCart(id: string) {
    this.cartItemsSignal.update(items => items.filter(i => i.id !== id));
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }

  placeOrder(shippingAddress: any) {
    const orderRequest = {
      shippingAddress: shippingAddress,
      cart: this.cartItemsSignal().map(item => ({
        boxSize: item.boxSize,
        quantity: item.quantity,
        chocolates: item.chocolates.map(choc => ({
          baseFlavor: choc.baseFlavor,
          filling: choc.filling
        }))
      }))
    };

    return this.http.post(`${environment.apiUrl}/orders`, orderRequest);
  }
}
