import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProdottoPageComponent } from './create-prodotto-page';

describe('CreateProdottoPage', () => {
  let component: CreateProdottoPageComponent;
  let fixture: ComponentFixture<CreateProdottoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProdottoPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProdottoPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
