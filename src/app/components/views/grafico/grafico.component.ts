import { ViewChild, Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HeaderactionsService } from 'src/app/services/headeractions.service';
import { HeaderRowOutlet } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements AfterViewInit,OnInit {
  reportEmbedInfo$!:Observable<any[]>;
  reportFromTable$!: any;
  reportTitle!: any;
  panelFavorite:boolean = false;
  panelInfos!:any;
  userId!:number;

  publicFrame:boolean = false;

  constructor(
    private api: ApiService,
    private actions: HeaderactionsService,
    private router: Router
  ){}

  ngOnInit(): void {

    this.panelInfos = JSON.parse( localStorage.getItem("panelInfos") );

    if( !this.panelInfos.publico && (this.panelInfos.rpId || this.panelInfos.wsId) ){

      this.api.getPainel(this.panelInfos.wsId,this.panelInfos.rpId)
          .subscribe(data => {
          this.reportFromTable$ = data;
          this.reportTitle = this.reportFromTable$['EmbedReport'][0]['ReportName'];
          this.getReports( this.reportFromTable$['EmbedToken']['Token'], this.reportFromTable$['EmbedReport'][0]['ReportId'], this.panelInfos.wsId )
        });

    } else {
      this.reportTitle = this.panelInfos.nome;
    }

  }

  ngAfterViewInit(): void{
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getReports(token: any, reportId: any, workspaceId: any): void {
    const config = {
      type: 'report',
      id: reportId,
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + reportId + '&groupId=' + workspaceId,
      accessToken: token,
      tokenType: 1
    };

    // Grab the reference to the div HTML element that will host the report.
    const reportsContainer = <HTMLElement>document.getElementById(
      'reportsContainer'
    );

    // Embed the report and display it within the div container.
    const powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    const report = powerbi.embed(
      reportsContainer,
      config
    );

    // Report.off removes a given event handler if it exists.
    report.off('loaded');
    // Report.on will add an event handler which prints to Log window.
    report.on('loaded', function() {
      console.log('Loaded');
    });

    report.off('pageChanged');
    report.on('pageChanged', e => {
      console.log(e);
    });

    report.on('error', function(event) {
      console.log('detalhe', event.detail);
      report.off('error');
    });
  }

}
