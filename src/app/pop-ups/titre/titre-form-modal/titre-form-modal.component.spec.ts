import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitreFormModalComponent } from './titre-form-modal.component';

describe('TitreFormModalComponent', () => {
  let component: TitreFormModalComponent;
  let fixture: ComponentFixture<TitreFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitreFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitreFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
