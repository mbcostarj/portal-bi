import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoComponent } from './components/views/grafico/grafico.component';
import { HomeComponent } from './components/views/home/home.component';
import { LoginComponent } from './components/views/login/login.component';
import { ModulosComponent } from './components/views/modulos/modulos.component';
import { PaineisComponent } from './components/views/paineis/paineis.component';
import { TemasComponent } from './components/views/temas/temas.component';
import { UsuariosComponent } from './components/views/usuarios/usuarios.component';
import { GuardService } from './services/guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo:  'home'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuardService]
  },
  {
    path: 'grafico/:nomePainel',
    component: GraficoComponent,
    canActivate: [GuardService]
  },
  {
    path: 'modulos',
    component: ModulosComponent,
    canActivate: [GuardService]
  },
  {
    path: 'temas',
    component: TemasComponent,
    canActivate: [GuardService]
  },
  {
    path: 'paineis',
    component: PaineisComponent,
    canActivate: [GuardService]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [GuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
