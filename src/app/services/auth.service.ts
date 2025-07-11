import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  type: string;
  username: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface User {
  username: string;
  password: string;
  email: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8086/api/auth';
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token && !this.isTokenExpired(token)) {
        this.loadCurrentUser();
      }
    }
  }

  // Connexion
  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);
          this.loadCurrentUser();
        })
      );
  }

  // Inscription
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Rafraîchir le token
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    const request: TokenRefreshRequest = { refreshToken: refreshToken! };

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, request)
      .pipe(
        tap(response => {
          this.setToken(response.accessToken);
          // Le refresh token reste le même
        })
      );
  }

  // Déconnexion
  // Dans la méthode logout
logout(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
    tap(() => {
      this.clearTokens();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    }),
    catchError(error => {
      this.clearTokens();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      return throwError(() => error);
    })
  );
}

  // Obtenir les informations de l'utilisateur connecté
  getCurrentUser(): Observable<UserInfo> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfo>(`${this.apiUrl}/user`, { headers })
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  // Charger l'utilisateur actuel
  private loadCurrentUser(): void {
    if (this.isAuthenticated()) {
      this.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  // Obtenir le token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Obtenir le refresh token
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  // Sauvegarder le token
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', token);
    }
  }

  // Sauvegarder le refresh token
  private setRefreshToken(refreshToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Supprimer les tokens
  private clearTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Vérifier si le token est expiré
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  // Obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtenir les headers pour les requêtes authentifiées
  getAuthHttpHeaders(): HttpHeaders {
    return this.getAuthHeaders();
  }

  // Obtenir l'utilisateur actuel (valeur instantanée)
  getCurrentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    const user = this.getCurrentUserValue();
    return user?.role === role;
  }
}
