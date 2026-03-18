import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);
  cartService = inject(CartService);
  isLogged = signal<boolean>(this.authService.user.hasValue());
  
  cartCount = computed(() => 
    this.cartService.items().reduce((acc, item) => acc + item.stock, 0)
  );

  logout() {
    this.authService.logout();
    this.isLogged.set(false);
  }
}
