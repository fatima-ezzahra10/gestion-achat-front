import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { Client } from '../../models/client.model';
import { Titre } from '../../models/titre.model';
import { TransactionService } from '../../services/transaction.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionFormModalComponent } from '../../pop-ups/transaction/transaction-form-modal/transaction-form-modal.component';
import { TransactionViewModalComponent } from '../../pop-ups/transaction/transaction-view-modal/transaction-view-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-transaction',
  standalone: false,
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  clients: Client[] = [];
  titres: Titre[] = [];

  searchTerm = '';
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private transactionService: TransactionService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      transactions: this.transactionService.getAll(),
      clients: this.transactionService.getAllClients(),
      titres: this.transactionService.getAllTitres()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.transactions = data.transactions;
        this.clients = data.clients;
        this.titres = data.titres;
        this.enrichTransactions();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }

  searchTransactions(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredTransactions = this.transactions.filter(transaction =>
        transaction.clientNom?.toLowerCase().includes(term) ||
        transaction.titreNom?.toLowerCase().includes(term) ||
        transaction.typeTransaction?.toLowerCase().includes(term) ||
        transaction.id?.toString().includes(term) ||
        transaction.dateTransaction?.toLowerCase().includes(term) ||
        transaction.montantTotal?.toString().includes(term)
      );
    } else {
      this.filteredTransactions = [...this.transactions];
    }
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredTransactions = [...this.transactions];
  }

  enrichTransactions(): void {
    this.transactions = this.transactions.map(transaction => ({
      ...transaction,
      clientNom: this.getClientName(transaction.clientId),
      titreNom: this.getTitreName(transaction.titreId),
      montantTotal: this.calculateTotal(transaction.quantite, transaction.prixUnitaire)
    }));
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.nom : `Client #${clientId}`;
  }

  getTitreName(titreId: number): string {
    const titre = this.titres.find(t => t.id === titreId);
    return titre ? titre.nom : `Titre #${titreId}`;
  }

  calculateTotal(quantite: number, prixUnitaire: number): number {
    return quantite * prixUnitaire;
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(TransactionFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.clients = this.clients;
    modalRef.componentInstance.titres = this.titres;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadAllData();
      }
    }).catch(() => {});
  }

  openEditModal(transaction: Transaction): void {
    const modalRef = this.modalService.open(TransactionFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.transaction = transaction;
    modalRef.componentInstance.clients = this.clients;
    modalRef.componentInstance.titres = this.titres;
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadAllData();
      }
    }).catch(() => {});
  }

  openViewModal(transaction: Transaction): void {
    const modalRef = this.modalService.open(TransactionViewModalComponent, { size: 'lg' });
    modalRef.componentInstance.transaction = {
      ...transaction,
      clientNom: this.getClientName(transaction.clientId),
      titreNom: this.getTitreName(transaction.titreId),
      montantTotal: this.calculateTotal(transaction.quantite, transaction.prixUnitaire)
    };
  }

  openDeleteModal(transaction: Transaction): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Supprimer la transaction';
    modalRef.componentInstance.message = `Êtes-vous sûr de vouloir supprimer la transaction #${transaction.id} ?`;

    modalRef.result.then((result) => {
      if (result === true) {
        this.deleteTransaction(transaction.id!);
      }
    }).catch(() => {});
  }

  private deleteTransaction(id: number): void {
    this.loading = true;
    this.transactionService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Erreur lors de la suppression';
          this.loading = false;
        }
      });
  }
}
