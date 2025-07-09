import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../../models/client.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-form-modal',
  standalone: false,
  templateUrl: './client-form-modal.component.html',
  styleUrls: ['./client-form-modal.component.css']
})
export class ClientFormModalComponent implements OnInit {
  @Input() client?: Client;
  @Output() save = new EventEmitter<Client>();

  clientForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: [''],
      ville: [''],
      codePostal: [''],
      pays: [''],
      dateCreation: [''],
      statut: ['ACTIF', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.client) {
      // Mode modification - pré-remplir le formulaire
      this.clientForm.patchValue({
        ...this.client,
        dateCreation: this.client.dateCreation || new Date().toISOString().split('T')[0]
      });
    } else {
      // Mode création - définir la date du jour
      this.clientForm.patchValue({
        dateCreation: new Date().toISOString().split('T')[0]
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Préparer les données du client
    const formValue = this.clientForm.getRawValue();
    const clientData: Client = {
      ...formValue,
      // Conserver l'ID en mode modification, undefined en mode création
      id: this.client?.id
    };

    // Émettre les données vers le composant parent
    this.save.emit(clientData);
  }

  // Méthode pour réinitialiser l'état de sauvegarde (appelée depuis le parent)
  resetSaving(): void {
    this.isSaving = false;
  }
}
