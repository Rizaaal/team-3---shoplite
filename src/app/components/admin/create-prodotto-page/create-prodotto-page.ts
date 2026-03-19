

import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { Product } from '../../shared/product-card/product-card';
import { ProductsService } from '../../../services/products.service';
import { ProdottoFormComponent } from '../prodotto-form/prodotto-form';
import { ProdottoPreviewComponent } from '../prodotto-preview/prodotto-preview';
import { ProdottiListComponent } from '../prodotti-list/prodotti-list';

@Component({
  selector: 'app-create-prodotto-page',
  standalone: true,
  imports: [CommonModule, ProdottoFormComponent, ProdottoPreviewComponent, ProdottiListComponent],
  templateUrl: './create-prodotto-page.html',
  styleUrl: './create-prodotto-page.css',
})
export class CreateProdottoPageComponent implements OnInit {
  private service = inject(ProductsService);
  private location = inject(Location);

  // Riferimento al componente figlio (il form)
  @ViewChild(ProdottoFormComponent) formComponent!: ProdottoFormComponent;

  product = signal<Product | null>(null);
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal('');

  async ngOnInit() {
    try {
      this.products.set(await this.service.getProducts());
    } catch (error) {
      console.error(error);
      this.error.set('Errore caricamento prodotti');
    }
  }

  async handleCreateProduct(event: { formData: FormProduct; file: File | null }) {
    if (!event.file) {
      this.error.set("Seleziona un'immagine");
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      // 1. Upload Immagine
      const upload = await this.service.uploadProductImage(event.file);

      // 2. Creazione Prodotto
      const payload: FormProduct = {
        ...event.formData,
        image: upload.url,
      };

      const created = await this.service.createProduct(payload);

      // 3. Aggiorna interfaccia (Anteprima Live e Inventario)
      this.product.set(created);
      this.products.set([created, ...this.products()]);

      // --- 4. RESET AUTOMATICO DEL FORM ---
      this.formComponent.resetForm();
      
      console.log('Prodotto creato e form resettato!');

    } catch (error: any) {
      console.error(error);
      this.error.set(error.message || 'Errore creazione prodotto');
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.location.back();
  }
}

export type FormProduct = Omit<Product, 'id'>;