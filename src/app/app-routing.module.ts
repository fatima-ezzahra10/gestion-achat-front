import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { ClientComponent } from './page/client/client.component';
import { TitreComponent } from './page/titre/titre.component';
import { TransactionComponent } from './page/transaction/transaction.component';
import { PrixComponent } from './page/prix/prix.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'client',
    component: ClientComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'titre',
    component: TitreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prix',
    component: PrixComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
