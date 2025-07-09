import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Titre } from '../../../models/titre.model';

@Component({
  selector: 'app-titre-view-modal',
  standalone: false,
  templateUrl: './titre-view-modal.component.html',
  styleUrls: ['./titre-view-modal.component.css']
})
export class TitreViewModalComponent {
  @Input() titre?: Titre;

  constructor(public activeModal: NgbActiveModal) {}
}
