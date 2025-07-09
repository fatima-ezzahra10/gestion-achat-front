export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  dateCreation?: string;
  statut: 'ACTIF' | 'INACTIF';
  // Ajout des propriétés qui pourraient être utilisées dans le back-end
  nbTransaction?: number;
}

// Enum pour le statut si nécessaire
export enum StatutClient {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF'
}
