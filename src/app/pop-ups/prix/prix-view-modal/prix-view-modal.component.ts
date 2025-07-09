import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Prix } from '../../../models/prix.model';
import { Titre } from '../../../models/titre.model';

@Component({
  selector: 'app-prix-view-modal',
  standalone: false,
  templateUrl: './prix-view-modal.component.html',
  styleUrls: ['./prix-view-modal.component.css']
})
export class PrixViewModalComponent {
  @Input() prix!: Prix;
  @Input() titre?: Titre;

  constructor(public activeModal: NgbActiveModal) {}
}
