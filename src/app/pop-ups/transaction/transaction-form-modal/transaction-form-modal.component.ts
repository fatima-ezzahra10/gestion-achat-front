import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../../models/transaction.model';
import { Client } from '../../../models/client.model';
import { Titre } from '../../../models/titre.model';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-form-modal',
  standalone: false,
  templateUrl: './transaction-form-modal.component.html',
  styleUrls: ['./transaction-form-modal.component.css']
})
export class TransactionFormModalComponent implements OnInit {
  form!: FormGroup;
  transaction?: Transaction;
  clients: Client[] = [];
  titres: Titre[] = [];
  isEdit = false;
  loading = false;
  error: string | null = null;

  typesTransaction: string[] = ['ACHAT', 'VENTE'];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.isEdit && this.transaction) {
      this.form.patchValue(this.transaction);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      titreId: ['', Validators.required],
      dateTransaction: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0.01, [Validators.required, Validators.min(0.01)]],
      typeTransaction: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const formValue = this.form.value;

    if (this.isEdit && this.transaction) {
      this.transactionService.update(this.transaction.id!, formValue)
        .subscribe({
          next: () => {
            this.activeModal.close('saved');
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.error = 'Erreur lors de la mise à jour';
            this.loading = false;
          }
        });
    } else {
      this.transactionService.create(formValue)
        .subscribe({
          next: (createdTransaction) => {
            this.transactionService.incrementTransactionCount(formValue.clientId)
              .subscribe({
                next: () => console.log('Compteur incrémenté avec succès'),
                error: (error) => console.error('Erreur lors de l\'incrémentation:', error)
              });
            this.activeModal.close('saved');
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.error = 'Erreur lors de la création';
            this.loading = false;
          }
        });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
}
