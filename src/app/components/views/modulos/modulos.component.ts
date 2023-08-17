import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModuloModalComponent } from '../../template/action-modal/modulo-modal.component';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';

export interface ModulosList {
  id: number,
  nome: string,
  active: any,
  action: any
}

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.scss']
})
export class ModulosComponent implements OnInit {
  pageTitle = "Gerenciar módulos";
  pageSubTitle = "Aqui você pode cadastrar, alterar ou desativar um módulo."

  tableData!: MatTableDataSource<ModulosList>
  modulos: ModulosList[];
  columnsToDisplay: string[] = [ 'id',  'nome', 'active', 'action' ]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private dialog: MatDialog, private api: ApiService) { }

  ngOnInit(): void {
    this.loadModulos();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  modalWidth = "70%";
  dialogTitle = "Adicionar módulo";
  private loadModulos() {
    this.api.getModulosLista()
      .subscribe(res => {
        this.modulos = res;
        this.tableData = new MatTableDataSource(this.modulos);
        this.tableData.paginator = this.paginator;
      });
  }

  public setFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLocaleLowerCase();
    if(this.tableData.paginator){
     this.tableData.paginator.firstPage();
    }
  }

  openDialog(action: string, row: any): void {

    if( action === "delete" ){
      this.modalWidth = '40%';
    } else {
      this.modalWidth = '80%';
    }

    if( action === "delete" ){
      this.dialogTitle = "Excluir módulo"
    } else if( action === "update" ){
      this.dialogTitle = "Alterar módulo"
    } else if( action === "add" ){
      this.dialogTitle = "Adicionar módulo"
    }

    const dialogRef = this.dialog.open(ModuloModalComponent, {
      width:this.modalWidth,
      data: {
        action: action,
        moduloNome: row.nome,
        modalTitle: this.dialogTitle,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Se liga só -> ", result);
      this.loadModulos();
    });
  }




}
