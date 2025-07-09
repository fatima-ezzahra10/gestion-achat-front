import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { ClientComponent } from './page/client/client.component';
import { TitreComponent } from './page/titre/titre.component';
import { TransactionComponent } from './page/transaction/transaction.component';
import { PrixComponent } from './page/prix/prix.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'client', component: ClientComponent },
  { path: 'titre', component: TitreComponent },
  { path: 'transaction', component: TransactionComponent },
  { path: 'prix', component: PrixComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
