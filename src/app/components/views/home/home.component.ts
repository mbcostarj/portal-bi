import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PainelFavoritoModel } from 'src/app/models/painel-favorito.model';
import { ApiService } from 'src/app/services/api.service';
import { HeaderactionsService } from 'src/app/services/headeractions.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  favoriteList: PainelFavoritoModel[];
  highlightList: PainelFavoritoModel[];
  imagePainelDefault = 'assets/images/power-bi.png';

  constructor(
    private router:Router,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.apiService.favoriteListUser()
      .subscribe(res => {
        if (res) {
          this.favoriteList = res;
        }
      });
    this.apiService.highlightListUser()
      .subscribe(res => {
        if (res) {
          this.highlightList = res;
        }
      });
  }

  setIds(
    idPainel:number,
    reportId: string,
    workspaceId: string,
    publico: string,
    url: string,
    name: string
  ){

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

  }

}
