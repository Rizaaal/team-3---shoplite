import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  cartEvent = output<Product>();

  product = input<Product>({
    id: 1,
    nome: 'prodotto',
    descrizione: 'descrizione',
    categoria: 'category',
    prezzo: 0,
    stock: 1,
    image: 'placeholder.jpg',
  });

  addToCart() {
    this.cartEvent.emit(this.product());
  }
}

export type Product = {
  id: number;
  nome: string;
  descrizione: string;
  categoria: string;
  prezzo: number;
  stock: number;
  image: string;
};
