import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFormModalComponent } from './transaction-form-modal.component';

describe('TransactionFormModalComponent', () => {
  let component: TransactionFormModalComponent;
  let fixture: ComponentFixture<TransactionFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
