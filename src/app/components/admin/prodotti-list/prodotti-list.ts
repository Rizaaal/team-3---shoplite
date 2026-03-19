/*import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotti-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prodotti-list.html',
  styleUrl: './prodotti-list.css'
})
export class ProdottiListComponent {
  @Input() products: Product[] = [];
}*/



import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from '../../shared/product-card/product-card';



@Component({

  selector: 'app-prodotti-list',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './prodotti-list.html',

  styleUrl: './prodotti-list.css'

})
export class ProdottiListComponent {
  @Input() products: Product[] = [];
  @Output() onEdit = new EventEmitter<Product>();
  @Output() onDelete = new EventEmitter<any>(); // Cambiato in any per sicurezza

  // FIX: Accetta sia string che number
  selectedId: string | number | null = null;

  toggleActions(id: string | number | undefined) {
    if (id === undefined) return;
    this.selectedId = this.selectedId === id ? null : id;
  }
}
  