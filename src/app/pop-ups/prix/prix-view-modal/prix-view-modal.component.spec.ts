import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixViewModalComponent } from './prix-view-modal.component';

describe('PrixViewModalComponent', () => {
  let component: PrixViewModalComponent;
  let fixture: ComponentFixture<PrixViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrixViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrixViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
