import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-view-modal',
  standalone: false,
  templateUrl: './transaction-view-modal.component.html',
  styleUrls: ['./transaction-view-modal.component.css']
})
export class TransactionViewModalComponent {
  @Input() transaction!: Transaction;

  constructor(public activeModal: NgbActiveModal) {}
}
