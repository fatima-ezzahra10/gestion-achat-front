import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8081/api/clients'; // URL de votre API

  constructor(private http: HttpClient) {}

  // Récupérer tous les clients - corrigé pour correspondre au endpoint du back-end
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/getAllClients`);
  }

  // Récupérer un client par ID
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Créer un client - corrigé pour correspondre au endpoint du back-end
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/createClient`, client);
  }

  // Modifier un client
  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
  }

  // Supprimer un client
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour le statut d'un client
  updateClientStatus(id: number, statut: 'ACTIF' | 'INACTIF'): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}/statut`, statut);
  }

  // Incrémenter le nombre de transactions
  incrementNbTransaction(id: number): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/${id}/increment-transactions`, {});
  }

  // Mettre à jour le compteur de transactions
  updateTransactionCount(id: number, delta: number): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/${id}/update-transaction-count?delta=${delta}`, {});
  }
}
