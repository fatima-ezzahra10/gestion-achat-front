export interface Titre {
  id?: number;
  code: string;
  nom: string;
  classe: string;
  categorie?: string;
  valeurNominale?: number;
  dateCreation?: string; // format ISO: 'yyyy-MM-dd'
  dateEcheance?: string;
  dateDemission?: string;
  devise?: string;
  actif: boolean;
}
