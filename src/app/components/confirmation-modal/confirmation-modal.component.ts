import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: false,
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
 
  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Êtes-vous sûr de vouloir continuer ?';

  constructor(public activeModal: NgbActiveModal) {}

}
