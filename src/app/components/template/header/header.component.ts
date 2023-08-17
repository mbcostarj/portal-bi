import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeaderactionsService } from 'src/app/services/headeractions.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NavComponent]
})

export class HeaderComponent implements OnInit {
  appTitle = "Portal BI";
  imagePath = 'assets/images';
  isLoginPage!:boolean;
  mostraFavorito!:boolean;
  login!:any;
  userId:number;
  panelInfos!:any;
  panelFavorite:boolean;

  constructor(
    private router: Router,
    private api:ApiService,
    public headerActions: HeaderactionsService,
    private authService: AuthService ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {

      if ( event instanceof NavigationEnd ){
        if (event && event.url) {
          this.isLoginPage = (event.url === "/login");
        }
        if( event.url.indexOf('grafico') > -1 ){
          this.mostraFavorito = true;
          this.isFavorite();
        } else {
          this.mostraFavorito = false;
        }
      }

    });

    this.defineLogin();

  }

  defineLogin() {
    if( localStorage.getItem('user') !== null ) {
      const user = this.headerActions.login();
      this.login = user;
    }
    this.headerActions.waitLogin()
      .subscribe(user => {
        this.login = user;
      });
  }

  isFavorite(){

    this.panelInfos = JSON.parse( localStorage.getItem("panelInfos") );
    this.userId = JSON.parse( localStorage.getItem("userId") );

    this.api.favoriteList(this.userId)
      .subscribe(res=>{
        this.panelFavorite = res.some( el => { return el.idPainel == this.panelInfos.idPainel } )
      });
      return this.panelFavorite;
  }

  toggleFavorite(){

    const favBody = {
      "idUsuario": this.userId,
      "idPainel": this.panelInfos.idPainel,
      "criacao": new Date()
    }

    if ( this.panelFavorite ) {
      this.api.unfavorite( favBody )
        .subscribe(res=>{
          if(res){
            this.panelFavorite = false;
          }
        });
    } else {
      this.api.favorite( favBody )
        .subscribe(res=>{
          //if(res){
            this.panelFavorite = true;
          //}
        });
    }
  }

  toggleRightSidenav() {
    this.headerActions.sideNavToggle();
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
