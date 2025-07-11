import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'gest_achats';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Vérifier l'authentification au démarrage
    this.authService.currentUser$.subscribe(user => {
      if (!user && this.authService.isAuthenticated()) {
        // Si pas d'utilisateur mais token valide, charger l'utilisateur
        this.authService.getCurrentUser().subscribe({
          error: () => {
            // Si erreur, rediriger vers login
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}
