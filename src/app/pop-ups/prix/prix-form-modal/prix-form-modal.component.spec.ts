import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixFormModalComponent } from './prix-form-modal.component';

describe('PrixFormModalComponent', () => {
  let component: PrixFormModalComponent;
  let fixture: ComponentFixture<PrixFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrixFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrixFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
