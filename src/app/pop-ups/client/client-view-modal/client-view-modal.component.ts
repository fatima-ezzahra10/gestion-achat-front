import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-view-modal',
  standalone: false,
  templateUrl: './client-view-modal.component.html',
  styleUrls: ['./client-view-modal.component.css']
})
export class ClientViewModalComponent {
  @Input() client?: Client;

  constructor(public activeModal: NgbActiveModal) {}
}
