import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { HeaderactionsService } from 'src/app/services/headeractions.service';
import { PERFIS } from 'src/utils/enums';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],

})
export class NavComponent implements  AfterViewInit, OnInit{

  @ViewChild(MatSidenav) sidenav!:MatSidenav;
  isLoginPage!:boolean;
  painelList$!:any;
  sidenavMode!: string;
  containerClass!: string;
  adminMenu: boolean;

  constructor(
    private router: Router,
    private service:ApiService,
    private actions:HeaderactionsService ){ }

  ngOnInit(): void {
    this.adminMenu = this.actions.defineAdminGestorMenu();
    this.actions.waitLogin()
      .subscribe(res => {
        this.adminMenu = this.actions.defineAdminGestorMenu();
      });
  }

  ngAfterViewInit(): void {
    this.actions.setSidenav(this.sidenav)

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && event.url) {
        this.isLoginPage    = (event.url === "/login");
        this.containerClass = event.url.substring(1);

        if ( event.url == "/home" || event.url == "/" ){
          setTimeout( ()=>this.actions.sideNavOpen(), 3000);
          this.actions.sideNavMode("side");
        } else {
          this.actions.sideNavMode("over");
        }

        if ( event.url != "/login"){
          this.service.getPainelList()
            .subscribe( (res) => {
              this.painelList$ = res;
              if ( event.url == "/home" ){
                this.actions.sideNavOpen();
              }
          });
        }

      }
    });
  };


  setIds(idPainel:number, reportId: string, workspaceId: string, publico: string, url: string, name: string){

    if ( localStorage.getItem('panelInfos') ){
      localStorage.removeItem('panelInfos')
    }

    const panelinfos = {
      idPainel: idPainel,
      nome: name,
      rpId: reportId,
      wsId: workspaceId,
      publico: publico,
      url: url
    }
    localStorage.setItem('panelInfos', JSON.stringify(panelinfos));
    this.sidenav.close();

  }

  closeNav(){
    this.actions.sideNavClose();
  }

}
