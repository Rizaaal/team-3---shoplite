import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottiListComponent } from './prodotti-list';

describe('ProdottiListComponent', () => {
  let component: ProdottiListComponent;
  let fixture: ComponentFixture<ProdottiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdottiListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdottiListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
