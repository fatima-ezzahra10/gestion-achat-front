import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionViewModalComponent } from './transaction-view-modal.component';

describe('TransactionViewModalComponent', () => {
  let component: TransactionViewModalComponent;
  let fixture: ComponentFixture<TransactionViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
