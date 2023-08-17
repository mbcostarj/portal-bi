import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import MESSAGES from 'src/utils/messages';


@Component({
  selector: 'app-modulo-modal',
  templateUrl: './modulo-modal.component.html',
  styleUrls: ['./modulo-modal.component.scss']
})
export class ModuloModalComponent implements OnInit  {

  today = new Date()
  regStatus = false;

  public moduloForm!: FormGroup
  hideRequiredControl = new FormControl(true);

  constructor( @Inject(MAT_DIALOG_DATA)
    public dataModal: any,
    public dialogRef: MatDialogRef<ModuloModalComponent>,
    private fb: FormBuilder,
    private api:ApiService,
    private toast: ToastrService
  ){ }

  ngOnInit(): void {

    console.log(this.dataModal);

    this.moduloForm = this.fb.group({
      nome:["",Validators.required],
      ativo:["",Validators.required],
    })

    if (this.dataModal.action === "update"){
      this.moduloForm.controls['nome'].setValue(this.dataModal.row.nome);
      this.moduloForm.controls['ativo'].setValue(this.dataModal.row.ativo);
    }

  }


  setModulo(){

    this.moduloForm.value.ultAtualizacao = this.today;
    
    if (this.moduloForm.invalid) {
      this.toast.error(MESSAGES.error.form.invalid)
      return
    }

    switch (this.dataModal.action) {
      case "add":
        this.adicionaModulo();
        break;
      case "update":
        this.alteraModulo();
        break;
      case "delete":
        this.deletaModulo();
        break;
    }

  }

  private erroPossuiMensagem(err: any) {
    return err && err.error;
  }

  private deletaModulo() {
    this.api.deleteModulo(this.dataModal.row.id)
      .subscribe(res => {
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

  private alteraModulo() {
    this.moduloForm.value.idModulo = this.dataModal.row.id;
    this.api.updateModulo(this.moduloForm.value)
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

  private adicionaModulo() {
    this.moduloForm.value.criacao = this.today;
    this.api.addModulo(this.moduloForm.value)
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


