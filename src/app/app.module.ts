import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ClientComponent } from './page/client/client.component';
import { TransactionComponent } from './page/transaction/transaction.component';
import { PrixComponent } from './page/prix/prix.component';
import { TitreComponent } from './page/titre/titre.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClientFormModalComponent } from './pop-ups/client/client-form-modal/client-form-modal.component';
import { ClientViewModalComponent } from './pop-ups/client/client-view-modal/client-view-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { TitreFormModalComponent } from './pop-ups/titre/titre-form-modal/titre-form-modal.component';
import { TitreViewModalComponent } from './pop-ups/titre/titre-view-modal/titre-view-modal.component';
import { TransactionFormModalComponent } from './pop-ups/transaction/transaction-form-modal/transaction-form-modal.component';
import { TransactionViewModalComponent } from './pop-ups/transaction/transaction-view-modal/transaction-view-modal.component';
import { PrixFormModalComponent } from './pop-ups/prix/prix-form-modal/prix-form-modal.component';
import { PrixViewModalComponent } from './pop-ups/prix/prix-view-modal/prix-view-modal.component';
import { Chart, registerables } from 'chart.js';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    ClientComponent,
    TitreComponent,
    TransactionComponent,
    PrixComponent,
    DashboardComponent,
    NavbarComponent,
    ClientFormModalComponent,
    ClientViewModalComponent,
    ConfirmationModalComponent,
    TitreFormModalComponent,
    TitreViewModalComponent,
    TransactionFormModalComponent,
    TransactionViewModalComponent,
    PrixFormModalComponent,
    PrixViewModalComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
