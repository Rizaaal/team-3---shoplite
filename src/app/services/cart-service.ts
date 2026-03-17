import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>([]);

  add(product: CartItem) {
    this.items.update((cart) => {
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        return cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...cart, { ...product, qty: 1 }];
    });
  }

  updateQty(id: number, qty: number) {
    this.items.update((cart) => cart.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  remove(id: number) {
    this.items.update((cart) => cart.filter((i) => i.id !== id));
  }

  clear() {
    this.items.set([]);
  }
}

export type CartItem = {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
  image: string;
  qty: number;
};
