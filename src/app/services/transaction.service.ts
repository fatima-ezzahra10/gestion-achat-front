import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { Observable, catchError, throwError } from 'rxjs';
import { Client } from '../models/client.model';
import { Titre } from '../models/titre.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8084/api/transactions';
  private clientApiUrl = 'http://localhost:8081/api/clients';
  private titreApiUrl = 'http://localhost:8083/api/titres';

  constructor(private http: HttpClient) {}

  // MÉTHODES POUR LES TRANSACTIONS
  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/all`)
      .pipe(catchError(this.handleError));
  }

  create(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/create`, transaction)
      .pipe(catchError(this.handleError));
  }

  update(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  search(criteria: any): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.apiUrl}/search`, criteria)
      .pipe(catchError(this.handleError));
  }

  // MÉTHODES POUR LES CLIENTS
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.clientApiUrl}/getAllClients`)
      .pipe(catchError(this.handleError));
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.clientApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  incrementTransactionCount(clientId: number): Observable<any> {
    return this.http.post(`${this.clientApiUrl}/${clientId}/increment-transactions`, null)
      .pipe(catchError(this.handleError));
  }

  updateTransactionCount(clientId: number, delta: number): Observable<any> {
    return this.http.post(`${this.clientApiUrl}/${clientId}/update-transaction-count?delta=${delta}`, null)
      .pipe(catchError(this.handleError));
  }

  // MÉTHODES POUR LES TITRES
  getAllTitres(): Observable<Titre[]> {
    return this.http.get<Titre[]>(`${this.titreApiUrl}/all`)
      .pipe(catchError(this.handleError));
  }

  getTitreById(id: number): Observable<Titre> {
    return this.http.get<Titre>(`${this.titreApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // GESTION DES ERREURS
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
