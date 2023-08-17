import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PainelModalComponent } from '../../template/action-modal/painel-modal.component';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';

export interface PaineisList {
  id: number,
  nome: string,
  modulo: string,
  active: boolean,
  action: string
}

@Component({
  selector: 'app-paineis',
  templateUrl: './paineis.component.html',
  styleUrls: ['./paineis.component.scss']
})
export class PaineisComponent implements AfterViewInit {
  pageTitle = "Gerenciar paineis";
  pageSubTitle = "Aqui você pode cadastrar, alterar ou desativar um painel."

  tableData!: MatTableDataSource<PaineisList>
  paineis:any;
  columnsToDisplay: string[] = [ 'id',  'nome', 'tema', 'active', 'action' ]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService) {
    this.loadPaineis();
  }

  private loadPaineis() {
    this.api.getPaineisList()
      .subscribe(res => {
        this.paineis = res;
        this.tableData = new MatTableDataSource(this.paineis);
        this.tableData.paginator = this.paginator;
      });
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
  dialogTitle = "Adicionar painel";
  openDialog(action:string, row:any): void {

    if( action === "delete" ){
      this.dialogTitle = "Excluir painel"
      this.modalWidth = '40%';
    } else {
      this.modalWidth = '80%';
    }

    if( action === "update" ){
      this.dialogTitle = "Alterar painel"
    } else if( action === "add" ){
      this.dialogTitle = "Adicionar painel"
    }

    const dialogRef = this.dialog.open(PainelModalComponent, {
      width:this.modalWidth,
      data: {
        action: action,
        elmNome: row.nome,
        modalTitle: this.dialogTitle,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("DialogAction->", result);
      this.loadPaineis();
    });
  }




}
