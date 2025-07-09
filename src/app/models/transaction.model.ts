export interface Transaction {
  id?: number;
  clientId: number;
  clientNom?: string;
  titreId: number;
  titreNom?: string;
  dateTransaction: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal?: number;
  typeTransaction: string;
}

export interface Client {
  id: number;
  nom: string;
}

export interface Titre {
  id: number;
  nom: string;
}
