import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Prix } from '../models/prix.model';
import { Titre } from '../models/titre.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class PrixService {
  private baseUrlPrix = 'http://localhost:8085/api/prix';
  private titreApiUrl = 'http://localhost:8083/api/titres';

  constructor(private http: HttpClient) {}

  // Méthodes pour les prix
  getAll(): Observable<Prix[]> {
    return this.http.get<Prix[]>(`${this.baseUrlPrix}/all`);
  }

  getPrixById(id: number): Observable<Prix> {
    return this.http.get<Prix>(`${this.baseUrlPrix}/${id}`);
  }

  getPrixByTitreId(titreId: number): Observable<Prix[]> {
    return this.http.get<Prix[]>(`${this.baseUrlPrix}/titre/${titreId}`);
  }

  getLatestPrixByTitreId(titreId: number): Observable<Prix> {
    return this.http.get<Prix>(`${this.baseUrlPrix}/titre/${titreId}/latest`);
  }

  create(prix: Prix): Observable<Prix> {
    return this.http.post<Prix>(`${this.baseUrlPrix}/create`, prix);
  }

  update(id: number, prix: Prix): Observable<Prix> {
    return this.http.put<Prix>(`${this.baseUrlPrix}/${id}`, prix);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlPrix}/${id}`);
  }

  getPrixBetweenDates(dateDebut: string, dateFin: string): Observable<Prix[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<Prix[]>(`${this.baseUrlPrix}/periode`, { params });
  }

  getPrixByTitreAndPeriod(titreId: number, dateDebut: string, dateFin: string): Observable<Prix[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<Prix[]>(`${this.baseUrlPrix}/titre/${titreId}/periode`, { params });
  }

  checkPrixExists(titreId: number, datePrix: string): Observable<{exists: boolean}> {
    const params = new HttpParams()
      .set('titreId', titreId.toString())
      .set('datePrix', datePrix);
    return this.http.get<{exists: boolean}>(`${this.baseUrlPrix}/check`, { params });
  }

  // Nouvelles méthodes pour récupérer les titres
  getAllTitres(): Observable<Titre[]> {
    return this.http.get<Titre[]>(`${this.titreApiUrl}/all`);
  }

  getTitreById(id: number): Observable<Titre> {
    return this.http.get<Titre>(`${this.titreApiUrl}/${id}`);
  }

  search(titreId?: number, dateDebut?: string, dateFin?: string): Observable<Prix[]> {
    if (titreId && dateDebut && dateFin) {
      return this.getPrixByTitreAndPeriod(titreId, dateDebut, dateFin);
    } else if (titreId) {
      return this.getPrixByTitreId(titreId);
    } else if (dateDebut && dateFin) {
      return this.getPrixBetweenDates(dateDebut, dateFin);
    } else {
      return this.getAll();
    }
  }
}
