import { Component, signal } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  product = {
    name: '',
    description: '',
    price: 0,
    qty: 1,
  };
  submitted: boolean = false;
  productId = signal<string>('');

  // create form submit handler
  onSubmit(form: NgForm): void {
    console.log(this.productId());

    if (form.valid) {
      this.submitted = true;
      console.log(this.product);
    } else {
      console.error('invalid form');
    }
  }

  // update form submit handler
  onSubmitUpdate(form: NgForm): void {
    if (form.valid) {
      this.submitted = true;
      console.log(this.product);
    } else {
      console.error('invalid form');
    }
  }

  // delete form submit handler
  onSubmitDelete(form: NgForm): void {
    const ok = confirm('sicuro di eliminare il seguente prodotto?');
    if (ok) {
      console.log('product removed!');
    }
  }
}
