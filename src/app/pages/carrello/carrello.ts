import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello {
  router = inject(Router);
  cartService = inject(CartService);

  cartItems = computed(() => this.cartService.items());

  total = computed(() => this.cartItems().reduce((sum, item) => sum + item.prezzo * item.qty, 0));

  increaseQty(item: CartItem) {
    this.cartService.updateQty(item.id, item.qty + 1);
  }

  decreaseQty(item: CartItem) {
    if (item.qty > 1) this.cartService.updateQty(item.id, item.qty - 1);
  }

  removeItem(id: number) {
    this.cartService.remove(id);
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
