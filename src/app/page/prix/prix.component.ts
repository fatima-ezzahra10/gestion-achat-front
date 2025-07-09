import { Component, OnInit } from '@angular/core';
import { Prix } from '../../models/prix.model';
import { Titre } from '../../models/titre.model';
import { PrixService } from '../../services/prix.service';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrixFormModalComponent } from '../../pop-ups/prix/prix-form-modal/prix-form-modal.component';
import { PrixViewModalComponent } from '../../pop-ups/prix/prix-view-modal/prix-view-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-prix',
  standalone: false,
  templateUrl: './prix.component.html',
  styleUrls: ['./prix.component.css']
})
export class PrixComponent implements OnInit {
  listePrix: Prix[] = [];
  filteredPrix: Prix[] = [];
  titres: Titre[] = [];

  isLoading = false;
  searchTerm = '';
  errorMessage = '';

  constructor(
    private prixService: PrixService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      prix: this.prixService.getAll(),
      titres: this.prixService.getAllTitres()
    }).subscribe({
      next: (data) => {
        this.listePrix = data.prix;
        this.titres = data.titres;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
        this.isLoading = false;
      }
    });
  }

  searchPrix(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredPrix = this.listePrix.filter(prix => {
        const titre = this.titres.find(t => t.id === prix.titreId);
        return (
          prix.id?.toString().includes(term) ||
          titre?.code.toLowerCase().includes(term) ||
          titre?.nom.toLowerCase().includes(term) ||
          prix.datePrix.toLowerCase().includes(term) ||
          prix.valeur.toString().includes(term) ||
          prix.devise.toLowerCase().includes(term)
        );
      });
    } else {
      this.filteredPrix = [...this.listePrix];
    }
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredPrix = [...this.listePrix];
  }

  openAddModal() {
    const modalRef = this.modalService.open(PrixFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.titres = this.titres;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadData();
      }
    }).catch(() => {});
  }

  openEditModal(prix: Prix) {
    const modalRef = this.modalService.open(PrixFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.prix = prix;
    modalRef.componentInstance.titres = this.titres;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadData();
      }
    }).catch(() => {});
  }

  openViewModal(prix: Prix) {
    const modalRef = this.modalService.open(PrixViewModalComponent, { size: 'md' });
    modalRef.componentInstance.prix = prix;
    modalRef.componentInstance.titre = this.titres.find(t => t.id === prix.titreId);
  }

  openDeleteModal(prix: Prix) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Supprimer le prix';
    modalRef.componentInstance.message = `Êtes-vous sûr de vouloir supprimer le prix du ${prix.datePrix} ?`;

    modalRef.result.then((result) => {
      if (result === true) {
        this.deletePrix(prix.id!);
      }
    }).catch(() => {});
  }

  private deletePrix(id: number) {
    this.isLoading = true;
    this.prixService.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.errorMessage = 'Erreur lors de la suppression du prix';
        this.isLoading = false;
      }
    });
  }

  getTitreLabel(titreId: number): string {
    const titre = this.titres.find(t => t.id === titreId);
    return titre ? `${titre.code} - ${titre.nom}` : 'Titre introuvable';
  }
}
