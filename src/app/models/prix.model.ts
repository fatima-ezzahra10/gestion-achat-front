
// prix.model.ts
export interface Prix {
  id?: number;
  titreId: number;
  datePrix: string; // format ISO: 'yyyy-MM-dd'
  valeur: number;
  devise: string;
}

// titre.model.ts
export interface Titre {
  id: number;
  code: string;
  nom: string;
}

export interface TitreItem {
  label: string;
  value: number;
}
