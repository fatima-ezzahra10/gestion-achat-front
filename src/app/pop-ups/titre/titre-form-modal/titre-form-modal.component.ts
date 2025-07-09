import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Titre } from '../../../models/titre.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-titre-form-modal',
  standalone: false,
  templateUrl: './titre-form-modal.component.html',
  styleUrls: ['./titre-form-modal.component.css']
})
export class TitreFormModalComponent implements OnInit {
  @Input() titre?: Titre;
  @Output() save = new EventEmitter<Titre>();

  titreForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.titreForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      classe: ['', Validators.required],
      categorie: [''],
      valeurNominale: [null, [Validators.min(0)]],
      devise: ['MAD'],
      dateCreation: [''],
      dateEcheance: [''],
      dateDemission: [''],
      actif: [true]
    });
  }

  ngOnInit(): void {
    if (this.titre) {
      // Mode modification - pré-remplir le formulaire
      const titreData = { ...this.titre };

      // Formatter les dates pour les inputs de type date
      if (titreData.dateCreation) {
        titreData.dateCreation = this.formatDateForInput(titreData.dateCreation);
      }
      if (titreData.dateEcheance) {
        titreData.dateEcheance = this.formatDateForInput(titreData.dateEcheance);
      }
      if (titreData.dateDemission) {
        titreData.dateDemission = this.formatDateForInput(titreData.dateDemission);
      }

      this.titreForm.patchValue(titreData);
    } else {
      // Mode création - définir la date du jour pour la création
      this.titreForm.patchValue({
        dateCreation: new Date().toISOString().split('T')[0]
      });
    }
  }

  private formatDateForInput(dateString: string | Date): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Format YYYY-MM-DD pour les inputs de type date
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.titreForm.invalid) {
      this.titreForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Préparer les données du titre
    const formValue = this.titreForm.getRawValue();
    const titreData: Titre = {
      ...formValue,
      // Conserver l'ID en mode modification, undefined en mode création
      id: this.titre?.id
    };

    // Émettre les données vers le composant parent
    this.save.emit(titreData);
  }

  // Méthode pour réinitialiser l'état de sauvegarde (appelée depuis le parent)
  resetSaving(): void {
    this.isSaving = false;
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get code() { return this.titreForm.get('code'); }
  get nom() { return this.titreForm.get('nom'); }
  get classe() { return this.titreForm.get('classe'); }
  get valeurNominale() { return this.titreForm.get('valeurNominale'); }
}
