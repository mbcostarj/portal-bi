import { Injectable, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { LocalStorage } from 'src/utils/constrains';
import { ApiService } from './api.service';
import { PERFIS } from 'src/utils/enums';

@Injectable({
  providedIn: 'root'
})
export class HeaderactionsService {
  sidenav!: MatSidenav;
  userInfos!:any;
  private loginSubject = new Subject<any>();

  constructor(private api:ApiService ) { }

  trySendLogin() {
    if( localStorage.getItem('user') !== null ){
      this.loginSubject.next(this.login());
    }
  }

  waitLogin() {
    return this.loginSubject.asObservable();
  }

  public login(){
    if( localStorage.getItem('user') !== null ){
      this.userInfos = JSON.parse( localStorage.getItem(LocalStorage.user) );
      this.userInfos.idUsuario = localStorage.getItem(LocalStorage.userId);
      this.userInfos.profileUsuario = localStorage.getItem(LocalStorage.userProfile)
      return this.userInfos;
    }
  }

  defineAdminGestorMenu() {
    const isAdminGestorMenu = user => (user.profileUsuario == PERFIS.ADMIN || user.profileUsuario == PERFIS.GESTOR);

    if( localStorage.getItem('user') !== null ) {
      const user = this.login();
      return isAdminGestorMenu(user);
    } else {
      this.waitLogin()
        .subscribe(user => {
          return isAdminGestorMenu(user);
        });
    }
  }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public sideNavMode(mode: any){
    return this.sidenav.mode = mode;
  }

  public sideNavOpen() {
    return this.sidenav.open();
  }


  public sideNavClose() {
    return this.sidenav.close();
  }

  public sideNavToggle(): void {
    this.sidenav.toggle();
  }

  isFavoritePanel(idPainel){
    let result = false;
    this.api.favoriteList(7/*this.userInfos.id*/)
      .subscribe(res=>{
        console.log("favoriteList",res);
        console.log(idPainel)
        res.find(function(obj) {
          if(obj.idPainel === idPainel){
            result = true;
          }else{
            result = false;
          }
        })
        return result;
      });
  }

}
