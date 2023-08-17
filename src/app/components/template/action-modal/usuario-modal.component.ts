import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import MESSAGES from 'src/utils/messages';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { PERFIS } from 'src/utils/enums';
import { HeaderactionsService } from 'src/app/services/headeractions.service';
//import { formatWithOptions } from 'util';


@Component({
  selector: 'app-usuario-modal',
  templateUrl: './usuario-modal.component.html',
  styleUrls: ['./modulo-modal.component.scss']
})
export class UsuarioModalComponent implements OnInit  {

  today = new Date()
  regStatus = false;
  perfilLogin:number;
  perfilselected;

  public usuarioForm!: FormGroup
  hideRequiredControl = new FormControl(true);

  action:boolean = false;
  actionTerm:string = "adicionada"

  countPanels: number;
  countPanelsSelected: number;

  perfilCadastro:number;
  idUsuarioUpdate:number = 0;

  panelList        = [];
  permissionslList = [];
  permissionsGestorlList = [];
  selectTema:any;
  selectedPanel:{};
  selectedPermission:{};

  loading$ = this.loader.loading$;

  constructor( @Inject(MAT_DIALOG_DATA)
    public dataModal:any,
    public dialogRef: MatDialogRef<UsuarioModalComponent>,
    private fb:FormBuilder,
    private api:ApiService,
    public loader:LoadingService,
    private toast: ToastrService,
    private actions: HeaderactionsService
  ){ }

  ngOnInit(): void {

    this.api.getTemaListFull()
      .subscribe(result=>{
        result.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))
        this.selectTema = result
      })

    this.perfilLogin = this.actions.login().profileUsuario

    if (this.perfilLogin == 2 && this.dataModal.action != "update"){
      this.perfilselected = 3;
    }

    this.usuarioForm = this.fb.group({
      nome:["",Validators.required],
      login:["",Validators.required],
      perfil:["",Validators.required],
      tema:[""],
      painel:[""],
      painelPermissao:[""]
    })

    if (this.dataModal.action === "update"){
      this.usuarioForm.controls.nome.disable();
      this.usuarioForm.controls.login.disable();
      if (this.dataModal.row.perfil == 2){ //Se o usuario for GESTOR (2), dentro da ação UPDATE
        this.resolveSelectGestor()

      }else{
        this.api.getPainelAcesso(this.dataModal.userId)
          .subscribe(response=>{
            this.countPanelsSelected = response.length;
            this.permissionslList = response.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0));
          })

      }

      this.usuarioForm.controls['nome'].setValue(this.dataModal.row.nome);
      this.usuarioForm.controls['login'].setValue(this.dataModal.row.login);
      this.usuarioForm.controls['perfil'].setValue(this.dataModal.row.perfil);

      this.perfilCadastro = this.dataModal.row.perfil;

    }

  }

  changePerfil(event):void{
    this.perfilCadastro = event;
  }

  setFormPainel(event):void{
    let text = event.target.options[event.target.options.selectedIndex].text;
    let val = event.target.options[event.target.options.selectedIndex].value;
    this.selectedPanel = {
      "idPainel": val.substring(3),
      "nome": text,
      "index": event.target.options.selectedIndex
    }
  }

  setFormPermissao(event):void{
    let text = event.target.options[event.target.options.selectedIndex].text;
    let val = event.target.options[event.target.options.selectedIndex].value;
    this.selectedPermission = {
      "idPainel": val.substring(3),
      "nome": text,
      "index": event.target.options.selectedIndex
    }
  }

  changeTema(event){
    this.api.getPainelPorTema(event)
      .subscribe(res=>{
        this.countPanels = res.length;
        this.panelList = res.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0));
      });
  }
  changeTemaGestor(event){
    console.log(event);
    // this.api.getPainelPorTema(event)
    //   .subscribe(res=>{
    //     this.countPanels = res.length;
    //     this.panelList = res.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0));
    //   });
  }

  moveItem(from){

    if ( from === "left" ){

      this.api.addPermissao({
          "idPainel": parseInt( this.selectedPanel["idPainel"] ),
          "idUsuario":this.dataModal.userId,
          "criacao": this.today
        })
        .subscribe(res=>{
          this.panelList.splice( this.selectedPanel["index"],1 )
          this.permissionslList.unshift(this.selectedPanel)
          this.action = true;
        })

    }else if (from === "right"){

      this.api.deletePermissao({
        "idPainel": parseInt( this.selectedPermission["idPainel"] ),
        "idUsuario":this.dataModal.userId,
        "criacao": this.today
      })
      .subscribe(res=>{
        console.log(res);
        this.permissionslList.forEach((value,index)=>{
          if(value.idPainel==this.selectedPermission["idPainel"]) this.permissionslList.splice(index,1);
        });
        this.action = true;
        this.actionTerm = "removida"
      })

    }

  }

  setUsuario(){

    this.usuarioForm.value.ultAcesso = this.today;

    if (this.usuarioForm.invalid) {
      this.toast.error(MESSAGES.error.form.invalid)
      return
    }
    console.log(this.usuarioForm.value)

    switch (this.dataModal.action) {
      case "add":
        this.adicionaUsuario();
        break;
      case "update":
        this.alteraUsuario();
        break;
    }
  }

  private erroPossuiMensagem(err: any) {
    return err && err.error;
  }

  private resolveSelectGestor(){
    this.api.getTemaAcesso(this.dataModal.userId)
      .subscribe(res=>{
        for (var i=0;i<res.length;i++) {
          console.log(i)
          this.permissionsGestorlList.push(res[i].id)
        }
    })
  }

  private alteraUsuario() {
    if( this.idUsuarioUpdate == 0 ){
      this.usuarioForm.value.idUsuario = this.dataModal.row.id
    }else{
      this.usuarioForm.value.idUsuario = this.idUsuarioUpdate
    }
    this.api.updateUsuario(this.usuarioForm.value)
      .subscribe(res => {
        if (res) {
          this.toast.success(MESSAGES.success.form.setSuc);

          this.usuarioForm.value.tema.forEach(element => {
            //console.log(element)
            this.api.addPermissaoGestor({
              "idTema": element,
              "idUsuario": this.usuarioForm.value.idUsuario,
              "criacao": new Date()
            })
            .subscribe(res=>{
              console.log("permissoes",res);
            })
          });

          this.dialogRef.close();
        }
      }, err => {
        const message = this.erroPossuiMensagem(err) ?
          err.error : MESSAGES.error.form.setErro
        this.toast.error(message);
      });
  }

  private adicionaUsuario() {
    this.api.addUsuario(this.usuarioForm.value)
      .subscribe(res => {
        if (res) {
          this.dataModal.action = "update";
          this.toast.success(MESSAGES.success.form.regSuc);

          const perfil = this.usuarioForm.controls.perfil.value;

          if (perfil !== PERFIS.ADMIN) {
            this.api.getUserByLogin(this.usuarioForm.controls['login'].value) //busca usuario por login
              .subscribe(res => {
                this.dataModal.userId = res['id']; //Define ID do usuario para adicionar a permissão
                this.idUsuarioUpdate = res['id'];

                this.api.getPainelAcesso(res['id'])
                  .subscribe(response => {
                    this.permissionslList = response;
                  });

              });
          } else {
            this.dialogRef.close();
          }

        }

      }, err => {
        const message = this.erroPossuiMensagem(err) ?
          err.error : MESSAGES.error.form.regErro
        this.toast.error(message);
      });
  }
}


