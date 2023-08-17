import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TemaModalComponent } from '../../template/action-modal/tema-modal.component';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { HeaderactionsService } from 'src/app/services/headeractions.service';

export interface TemasList {
  id: number,
  nome: string,
  modulo: string,
  active: boolean,
  action: string
}

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements AfterViewInit {
  pageTitle = "Gerenciar temas";
  pageSubTitle = "Aqui você pode cadastrar, alterar ou desativar um tema."
  login;
  tableData!: MatTableDataSource<TemasList>
  temas:any;
  columnsToDisplay: string[] = [ 'id',  'nome', 'modulo', 'active', 'action' ]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService,
    private actions: HeaderactionsService) {

    this.loadTemas();

  }

  private loadTemas() {

    this.login = this.actions.login()

    if ( this.login.profileUsuario == 2 ){
      this.api.getTemaAcesso(this.login.idUsuario)
        .subscribe(res => {
          this.temas = res;
          this.tableData = new MatTableDataSource(this.temas);
          this.tableData.paginator = this.paginator;
          this.tableData.sort = this.sort;
        });
    }else{
      this.api.getTemaListFull()
        .subscribe(res => {
          this.temas = res;
          this.tableData = new MatTableDataSource(this.temas);
          this.tableData.paginator = this.paginator;
          this.tableData.sort = this.sort;
        });
    }
  }

  ngAfterViewInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  public setFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLocaleLowerCase();
    if(this.tableData.paginator){
      this.tableData.paginator.firstPage();
    }
  }

  modalWidth = "70%";
  dialogTitle = "Adicionar tema";
  openDialog(action: string, row:any): void {
    console.log(action)

    if( action === "delete" ){
      this.modalWidth = '40%';
    } else {
      this.modalWidth = '80%';
    }

    if( action === "delete" ){
      this.dialogTitle = "Excluir tema"
    } else if( action === "update" ){
      this.dialogTitle = "Alterar tema"
    } else if( action === "add" ){
      this.dialogTitle = "Adicionar tema"
    }

    const dialogRef = this.dialog.open(TemaModalComponent, {
      width:this.modalWidth,
      data: {
        action: action,
        nome: row.nome,
        modalTitle: this.dialogTitle,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Modal Tema -> ", result);
      this.loadTemas();
    });
  }




}
