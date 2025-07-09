import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Titre } from '../models/titre.model';

@Injectable({
  providedIn: 'root'
})
export class TitreService {
  private apiUrl = 'http://localhost:8083/api/titres';

  constructor(private http: HttpClient) {}

  // Récupérer tous les titres avec gestion d'erreur
  all(): Observable<Titre[]> {
    return this.http.get<Titre[]>(`${this.apiUrl}/all`);
  }

  addTitre(titre: Titre): Observable<Titre> {
    // Nettoyer l'objet avant envoi
    const titreToSend = { ...titre };
    delete titreToSend.id; // Supprimer l'ID pour la création

    return this.http.post<Titre>(`${this.apiUrl}/createTitre`, titreToSend);
  }

  updateTitre(titre: Titre): Observable<Titre> {
    if (!titre.id) {
      throw new Error('ID du titre requis pour la modification');
    }
    return this.http.put<Titre>(`${this.apiUrl}/${titre.id}`, titre);
  }

  deleteTitre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTitreById(id: number): Observable<Titre> {
    return this.http.get<Titre>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour rechercher des titres
  searchTitres(searchQuery: string): Observable<Titre[]> {
    return this.http.get<Titre[]>(`${this.apiUrl}/search?query=${encodeURIComponent(searchQuery)}`);
  }

  /* // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue s\'est produite';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de contacter le serveur. Vérifiez que l\'API est démarrée sur le port 8083.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  } */
}
