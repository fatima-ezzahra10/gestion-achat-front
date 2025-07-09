import { Component, OnInit } from '@angular/core';
import { Titre } from '../../models/titre.model';
import { TitreService } from '../../services/titre.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitreFormModalComponent } from '../../pop-ups/titre/titre-form-modal/titre-form-modal.component';
import { TitreViewModalComponent } from '../../pop-ups/titre/titre-view-modal/titre-view-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-titre',
  standalone: false,
  templateUrl: './titre.component.html',
  styleUrls: ['./titre.component.css']
})
export class TitreComponent implements OnInit {
  titres: Titre[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';

  constructor(
    private titreService: TitreService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadTitres();
  }

  loadTitres() {
    this.isLoading = true;
    this.errorMessage = '';

    this.titreService.all().subscribe({
      next: (data) => {
        this.titres = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des titres';
        this.titres = [];
        this.isLoading = false;
      }
    });
  }

  openAddModal() {
    const modalRef = this.modalService.open(TitreFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.mode = 'add';

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadTitres();
      }
    }).catch(() => {});
  }

  openEditModal(titre: Titre) {
    const modalRef = this.modalService.open(TitreFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.titre = { ...titre };

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadTitres();
      }
    }).catch(() => {});
  }

  openViewModal(titre: Titre) {
    const modalRef = this.modalService.open(TitreViewModalComponent, { size: 'lg' });
    modalRef.componentInstance.titre = { ...titre };
  }

  openDeleteModal(titre: Titre) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Confirmation de suppression';
    modalRef.componentInstance.message = `Êtes-vous sûr de vouloir supprimer le titre "${titre.nom}" ?`;

    modalRef.result.then((result) => {
      if (result === true) {
        this.deleteTitre(titre);
      }
    }).catch(() => {});
  }

  deleteTitre(titre: Titre) {
    this.isLoading = true;
    this.titreService.deleteTitre(titre.id!).subscribe({
      next: () => {
        this.loadTitres();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la suppression du titre';
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.titreService.searchTitres(this.searchQuery).subscribe({
        next: (data) => {
          this.titres = data || [];
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la recherche';
          this.isLoading = false;
        }
      });
    } else {
      this.loadTitres();
    }
  }

  resetSearch() {
    this.searchQuery = '';
    this.loadTitres();
  }

  trackByTitre(index: number, titre: Titre): any {
    return titre.id || index;
  }
}
