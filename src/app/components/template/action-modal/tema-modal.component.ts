import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import MESSAGES from 'src/utils/messages';


@Component({
  selector: 'app-tema-modal',
  templateUrl: './tema-modal.component.html',
  styleUrls: ['./modulo-modal.component.scss']
})
export class TemaModalComponent implements OnInit  {

  today = new Date()
  regStatus = false;
  listaModulos!:any;

  public temaForm!: FormGroup
  hideRequiredControl = new FormControl(true);

  constructor( @Inject(MAT_DIALOG_DATA)
    public dataModal: any, //array Dados do modal
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TemaModalComponent>,
    private api:ApiService,
    private toast: ToastrService
  ){ }

  ngOnInit(): void {

    this.api.getModulosListaSimples() //Lista de modulos para <select>
      .subscribe( (res:any) => {
        this.listaModulos = res;
      } );

    console.log(this.dataModal);

    this.temaForm = this.fb.group({
      nome:["",Validators.required]
      ,ativo:["",Validators.required]
      ,modulo:["",Validators.required]
    })

    if (this.dataModal.action === "update"){ //se ação for 'update', seta valores no form
      this.temaForm.controls['modulo'].patchValue(this.dataModal.row.idModulo);
      this.temaForm.controls['nome'].setValue(this.dataModal.row.nome);
      this.temaForm.controls['ativo'].patchValue(this.dataModal.row.ativo);
    }

  }


  setTema(){

    this.temaForm.value.ultAtualizacao = this.today;

    if(this.dataModal.action!='delete'){
      if (this.temaForm.invalid) {
        this.toast.error(MESSAGES.error.form.invalid)
        return
      }
    }

    switch (this.dataModal.action) {
      case "add":
        this.adicionaTema();
        break;
      case "update":
        this.alteraTema();
        break;
      case "delete":
        this.deletaTema();
        break;
    }

  }

  private erroPossuiMensagem(err: any) {
    return err && err.error;
  }

  private deletaTema() {
    this.api.deleteTema(this.dataModal.row.id)
      .subscribe(res => {
        console.log(res)
        if (res) {
          this.toast.success(MESSAGES.success.form.delSuc);
          this.dialogRef.close();
        }
      }, err => {
        const message = this.erroPossuiMensagem(err) ?
          err.error : MESSAGES.error.form.delErro
        this.toast.error(message);
      });
  }

  private alteraTema() {
    this.temaForm.value.id = this.dataModal.row.id;
    this.temaForm.value.idModulo = this.temaForm.value.modulo;

    this.api.updateTema(this.temaForm.value)
      .subscribe(res => {
        if (res) {
          this.toast.success(MESSAGES.success.form.setSuc);
          this.dialogRef.close();
        }
      }, err => {
        const message = this.erroPossuiMensagem(err) ?
          err.error : MESSAGES.error.form.setErro
        this.toast.error(message);
      });
  }

  private adicionaTema() {
    this.temaForm.value.criacao = this.today;
    console.log("formValue", this.temaForm.value);
    this.api.addTema(this.temaForm.value)
      .subscribe(res => {
        if (res) {
          this.toast.success(MESSAGES.success.form.regSuc);
          this.dialogRef.close();
        }
      }, err => {
        const message = this.erroPossuiMensagem(err) ?
          err.error : MESSAGES.error.form.regErro
        this.toast.error(message);
      });
  }
}


