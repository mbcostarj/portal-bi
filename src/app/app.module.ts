import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/template/header/header.component';
import { NavComponent } from './components/template/nav/nav.component';
import { LoginComponent } from './components/views/login/login.component';
import { GraficoComponent } from './components/views/grafico/grafico.component';
import { ModulosComponent } from './components/views/modulos/modulos.component';
import { ModuloModalComponent } from './components/template/action-modal/modulo-modal.component';
import { UsuariosComponent } from './components/views/usuarios/usuarios.component';
import { UsuarioModalComponent } from './components/template/action-modal/usuario-modal.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPowerBiModule } from 'ngx-powerbi';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/*
 * Material */
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
//import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from'@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
/* / Material */


import { ApiService } from './services/api.service';
import { HomeComponent } from './components/views/home/home.component';
import { TemasComponent } from './components/views/temas/temas.component';
import { TemaModalComponent } from './components/template/action-modal/tema-modal.component';
import { PainelModalComponent } from './components/template/action-modal/painel-modal.component';
import { PaineisComponent } from './components/views/paineis/paineis.component';
import { ConfigService } from './services/config.service';
import { RequestInterceptor } from './services/request-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { ToastPosition } from './models/toast-position.model';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    LoginComponent,
    GraficoComponent,
    ModulosComponent,
    ModuloModalComponent,
    HomeComponent,
    TemasComponent,
    TemaModalComponent,
    PainelModalComponent,
    PaineisComponent,
    UsuariosComponent,
    UsuarioModalComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatExpansionModule,
    NgxPowerBiModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot({ preventDuplicates: true, progressBar: true, positionClass: ToastPosition.topRight })
  ],
  providers: [
    ApiService,
    [
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return () => {
            return configService.loadConfig();
          };
        }
      },
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestInterceptor,
        multi: true
      }
    ],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
