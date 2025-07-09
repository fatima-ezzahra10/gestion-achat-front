import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Prix } from '../../../models/prix.model';
import { Titre } from '../../../models/titre.model';
import { PrixService } from '../../../services/prix.service';

@Component({
  selector: 'app-prix-form-modal',
  standalone: false,
  templateUrl: './prix-form-modal.component.html',
  styleUrls: ['./prix-form-modal.component.css']
})
export class PrixFormModalComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() prix?: Prix;
  @Input() titres: Titre[] = [];

  prixForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private prixService: PrixService
  ) {
    this.prixForm = this.fb.group({
      titreId: [null, Validators.required],
      datePrix: ['', Validators.required],
      valeur: [null, [Validators.required, Validators.min(0)]],
      devise: ['MAD', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.prix) {
      this.prixForm.patchValue({
        titreId: this.prix.titreId,
        datePrix: this.prix.datePrix,
        valeur: this.prix.valeur,
        devise: this.prix.devise
      });
    }
  }

  save() {
    if (this.prixForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.prixForm.value;
    const prix: Prix = {
      titreId: formValue.titreId,
      datePrix: formValue.datePrix,
      valeur: formValue.valeur,
      devise: formValue.devise
    };

    this.isLoading = true;
    this.errorMessage = '';

    if (this.mode === 'edit' && this.prix?.id) {
      prix.id = this.prix.id;
      this.prixService.update(this.prix.id, prix).subscribe({
        next: () => {
          this.activeModal.close('saved');
        },
        error: (error) => {
          this.handleError(error, 'modification');
        }
      });
    } else {
      this.prixService.create(prix).subscribe({
        next: () => {
          this.activeModal.close('saved');
        },
        error: (error) => {
          this.handleError(error, 'création');
        }
      });
    }
  }

  private handleError(error: any, action: string) {
    console.error(`Erreur lors de la ${action}:`, error);
    if (error.status === 409) {
      this.errorMessage = 'Un prix existe déjà pour ce titre à cette date';
    } else {
      this.errorMessage = `Erreur lors de la ${action} du prix`;
    }
    this.isLoading = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.prixForm.controls).forEach(key => {
      this.prixForm.get(key)?.markAsTouched();
    });
  }

  getTitreLabel(titreId: number): string {
    const titre = this.titres.find(t => t.id === titreId);
    return titre ? `${titre.code} - ${titre.nom}` : 'Titre introuvable';
  }
}
