import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitreViewModalComponent } from './titre-view-modal.component';

describe('TitreViewModalComponent', () => {
  let component: TitreViewModalComponent;
  let fixture: ComponentFixture<TitreViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitreViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitreViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
