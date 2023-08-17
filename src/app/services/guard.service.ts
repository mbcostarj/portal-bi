import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorage } from 'src/utils/constrains';
import { FuncionarioModel } from '../models/funcionario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  async canActivate(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
      if(localStorage.getItem(LocalStorage.token)) {
        this.authService.renovarToken()
          .catch(e => this.logout());
      }
      
      const token = localStorage.getItem(LocalStorage.token);
      const usuario = JSON.parse(localStorage.getItem(LocalStorage.user));

      if (!token || !usuario) {
          this.logout();
          return false;
      }

      return true;
  }

  private logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
} 
