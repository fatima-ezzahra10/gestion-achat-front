import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientFormModalComponent } from '../../pop-ups/client/client-form-modal/client-form-modal.component';
import { ClientViewModalComponent } from '../../pop-ups/client/client-view-modal/client-view-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
 
@Component({
  selector: 'app-client',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private clientService: ClientService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.errorMessage = 'Erreur lors du chargement des clients.';
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    const modalRef = this.modalService.open(ClientFormModalComponent, { size: 'lg' });

    modalRef.componentInstance.save.subscribe((newClient: Client) => {
      this.createClient(newClient, modalRef);
    });
  }

  private createClient(client: Client, modalRef: any): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.createClient(client).subscribe({
      next: (createdClient) => {
        console.log('Client créé avec succès:', createdClient);
        this.loadClients(); // Recharger la liste
        modalRef.close('saved'); // Fermer le modal
        this.isLoading = false;
        // Optionnel: afficher un message de succès
        this.showSuccessMessage('Client créé avec succès!');
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.errorMessage = 'Erreur lors de la création du client: ' + (error.message || 'Erreur inconnue');
        this.isLoading = false;
        // Réinitialiser l'état de sauvegarde du modal
        modalRef.componentInstance.resetSaving();
      }
    });
  }

  openEditModal(client: Client): void {
    const modalRef = this.modalService.open(ClientFormModalComponent, { size: 'lg' });
    modalRef.componentInstance.client = { ...client }; // Passer une copie

    modalRef.componentInstance.save.subscribe((updatedClient: Client) => {
      this.updateClient(updatedClient, modalRef);
    });
  }

  private updateClient(client: Client, modalRef: any): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.updateClient(client).subscribe({
      next: (updatedClient) => {
        console.log('Client mis à jour avec succès:', updatedClient);
        this.loadClients(); // Recharger la liste
        modalRef.close('saved');
        this.isLoading = false;
        this.showSuccessMessage('Client modifié avec succès!');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du client: ' + (error.message || 'Erreur inconnue');
        this.isLoading = false;
        // Réinitialiser l'état de sauvegarde du modal
        modalRef.componentInstance.resetSaving();
      }
    });
  }

  openViewModal(client: Client): void {
    const modalRef = this.modalService.open(ClientViewModalComponent, { size: 'lg' });
    modalRef.componentInstance.client = client;
  }

  deleteClient(client: Client): void {
  const modalRef = this.modalService.open(ConfirmationModalComponent);
  modalRef.componentInstance.title = 'Confirmer la suppression';
  modalRef.componentInstance.message = `Voulez-vous vraiment supprimer le client ${client.nom} ${client.prenom} ?`;

  modalRef.result.then((confirmed) => {
    if (confirmed) {
      this.isLoading = true;
      this.errorMessage = '';

      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          console.log('Client supprimé avec succès');
          this.loadClients();
          this.isLoading = false;
          this.showSuccessMessage('Client supprimé avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression du client: ' + (error.message || 'Erreur inconnue');
          this.isLoading = false;
        }
      });
    }
  }).catch(() => {
    // Fermeture sans confirmation (annulation)
  });
}

  searchClients(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredClients = this.clients.filter(client =>
        client.nom?.toLowerCase().includes(term) ||
        client.prenom?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.telephone?.toLowerCase().includes(term) ||
        client.ville?.toLowerCase().includes(term)
      );
    } else {
      this.filteredClients = [...this.clients];
    }
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.filteredClients = [...this.clients];
  }

  get displayedClients(): Client[] {
    return this.filteredClients;
  }

  // Méthode utilitaire pour afficher les messages de succès (optionnel)
  private showSuccessMessage(message: string): void {
    // Vous pouvez implémenter un système de toast ou notification ici
    console.log('Succès:', message);
  }
}
