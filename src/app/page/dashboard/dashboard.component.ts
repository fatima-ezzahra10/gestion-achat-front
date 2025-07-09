import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    clients: 42,
    titres: 15,
    transactions: 128,
    prix: 89
  };

  recentClients = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com' },
    { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com' },
    { id: 3, nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@example.com' }
  ];

  recentTitres = [
    { id: 1, code: 'AAPL', nom: 'Apple Inc.' },
    { id: 2, code: 'MSFT', nom: 'Microsoft Corporation' },
    { id: 3, code: 'GOOGL', nom: 'Alphabet Inc.' }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initCharts();
  }

  initCharts() {
    // Couleurs réutilisables
    const primaryColor = 'rgba(26, 35, 126, 0.7)';
    const secondaryColor = 'rgba(38, 166, 154, 0.7)';
    const infoColor = 'rgba(3, 169, 244, 0.7)';
    const warningColor = 'rgba(255, 193, 7, 0.7)';

    // Clients par mois
    new Chart('clientsChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Nouveaux clients',
          data: [5, 8, 6, 9, 7, 10],
          backgroundColor: primaryColor
        }]
      },
      options: this.getChartOptions('Clients par mois')
    });

    // Répartition des titres
    new Chart('titresChart', {
      type: 'pie',
      data: {
        labels: ['Actions', 'Obligations', 'ETF', 'Fonds'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: [
            primaryColor,
            secondaryColor,
            infoColor,
            warningColor
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom' as const // <-- Correction ici aussi
          },
          title: {
            display: true,
            text: 'Répartition des titres'
          }
        }
      }
    });

    // Transactions récentes
    new Chart('transactionsChart', {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        datasets: [{
          label: 'Transactions',
          data: [12, 19, 15, 22, 20, 8],
          borderColor: secondaryColor,
          backgroundColor: 'rgba(38, 166, 154, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: this.getChartOptions('Transactions par jour')
    });

    // Évolution des prix
    new Chart('prixChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'AAPL',
            data: [150, 155, 148, 160, 165, 170],
            borderColor: primaryColor,
            borderWidth: 2
          },
          {
            label: 'MSFT',
            data: [250, 245, 255, 260, 265, 270],
            borderColor: secondaryColor,
            borderWidth: 2
          }
        ]
      },
      options: this.getChartOptions('Évolution des prix', true)
    });
  }

  private getChartOptions(title: string, showLegend = false): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: 'bottom' as const // <-- Correction principale
        },
        title: {
          display: true,
          text: title
        }
      }
    };
  }
}
