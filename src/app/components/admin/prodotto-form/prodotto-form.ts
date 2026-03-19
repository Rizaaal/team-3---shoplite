/*import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prodotto-form.html',
  styleUrl: './prodotto-form.css'
})
export class ProdottoFormComponent {
  private fb = inject(FormBuilder);

  @Input() loading = false;

  @Output() createProduct = new EventEmitter<{
    formData: Omit<Product, 'id'>;
    file: File | null;
  }>();

  file: File | null = null;

  // Inizializzati a null per mostrare il placeholder
  form = this.fb.group({
    nome: ['', Validators.required],
    descrizione: ['', Validators.required],
    prezzo: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
    categoria: ['', Validators.required],
  });

  categories = ['GPU', 'Memoria', 'Accessori', 'Case', 'CPU', 'Scheda Madre'];

  onFileChange(e: any) {
    this.file = e.target.files[0];
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const payload: Omit<Product, 'id'> = {
      nome: v.nome!,
      descrizione: v.descrizione!,
      prezzo: Number(v.prezzo ?? 0),
      stock: Number(v.stock ?? 0),
      categoria: v.categoria!,
      image: '',
    };

    this.createProduct.emit({
      formData: payload,
      file: this.file,
    });
  }

  // Metodo utile per resettare il form dopo l'invio
  resetForm() {
    this.form.reset();
    this.file = null;
  }
}*/

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-prodotto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prodotto-form.html',
  styleUrl: './prodotto-form.css'
})
export class ProdottoFormComponent {
  private fb = inject(FormBuilder);

  @Input() loading = false;

  @Output() createProduct = new EventEmitter<{
    formData: Omit<Product, 'id'>;
    file: File | null;
  }>();

  file: File | null = null;

  // Campi inizializzati a null per mostrare i placeholder
  form = this.fb.group({
    nome: ['', Validators.required],
    descrizione: ['', Validators.required],
    prezzo: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
    categoria: ['', Validators.required],
  });

  categories = ['GPU', 'Memoria', 'Accessori', 'Case', 'CPU', 'Scheda Madre'];

  onFileChange(e: any) {
    this.file = e.target.files[0];
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const payload: Omit<Product, 'id'> = {
      nome: v.nome!,
      descrizione: v.descrizione!,
      prezzo: Number(v.prezzo ?? 0),
      stock: Number(v.stock ?? 0),
      categoria: v.categoria!,
      image: '',
    };

    this.createProduct.emit({
      formData: payload,
      file: this.file,
    });
  }

  // Metodo richiamato dal componente padre dopo il successo
  resetForm() {
    this.form.reset(); // Svuota i campi
    this.file = null;  // Svuota la variabile file
    
    // Svuota fisicamente il selettore file nel browser
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}