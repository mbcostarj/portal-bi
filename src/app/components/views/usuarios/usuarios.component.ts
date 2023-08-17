import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { ConnectableObservable, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuarioModalComponent } from '../../template/action-modal/usuario-modal.component';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { HeaderactionsService } from 'src/app/services/headeractions.service';
import { LoadingService } from 'src/app/services/loading.service';

export interface ModulosList {
  id: number,
  nome: string,
  login: any,
  perfil: string,
  action: string
}
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  pageTitle = "Gerenciar usuários";
  pageSubTitle = "Aqui você pode cadastrarou alterar um usuário."

  login!:any;

  tableData!: MatTableDataSource<ModulosList>;
  users:any;
  columnsToDisplay: string[] = [ 'id',  'nome', 'login', 'perfil', 'action' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService,
    private header: HeaderactionsService) { }

  ngOnInit(): void {
    this.loadUsuarios();

    this.login = this.header.login();

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  modalWidth = "70%";
  dialogTitle = "Adicionar usuário";
  private loadUsuarios() {
    this.api.listaUsuarios()
      .subscribe(res => {
        this.trataPerfil(res);
        this.trataEdicao(res);
        this.users = res;
        this.tableData = new MatTableDataSource(this.users)
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
      });
  }

  public setFilter = (event: Event) => {
   const filterValue = (event.target as HTMLInputElement).value;
   this.tableData.filter = filterValue.trim().toLocaleLowerCase();
   if(this.tableData.paginator){
    this.tableData.paginator.firstPage();
   }
  }

  private trataEdicao(arr:any){ //decide se usuário logado pode editar ou não
    arr.forEach(element => {
       if(this.login.profileUsuario == 2 && element.perfil <= 2){
        element.showEdit = false
       }else{
        element.showEdit = true
       }
    });
  }

  private trataPerfil(arr:any){
    arr.forEach(element => {
      switch ( element.perfil ) {
        case 1:
          element.perfilLabel = "Administrador"
          break;
        case 2:
          element.perfilLabel = "Gestor"
          break;
        case 3:
          element.perfilLabel = "Usuario"
          break;
        default:
          break;
     }
    });
  }

  openDialog(action: string, row: any): void {

    if( action === "delete" ){
      this.modalWidth = '40%';
    } else {
      this.modalWidth = '80%';
    }

    if( action === "delete" ){
      this.dialogTitle = "Excluir usuário"
    } else if( action === "update" ){
      this.dialogTitle = "Alterar usuário"
    } else if( action === "add" ){
      this.dialogTitle = "Adicionar usuário"
    }

    const dialogRef = this.dialog.open(UsuarioModalComponent, {
      width:this.modalWidth,
      data: {
        action: action,
        userName: row.nome,
        userId: row.id,
        modalTitle: this.dialogTitle,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("Se liga só -> ", result);
      this.loadUsuarios();
    });
  }




}
