import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import MESSAGES from 'src/utils/messages';


@Component({
  selector: 'app-painel-modal',
  templateUrl: './painel-modal.component.html',
  styleUrls: ['./modulo-modal.component.scss']
})
export class PainelModalComponent implements OnInit  {

  today = new Date()
  regStatus = false;
  listaTemas!:any;
  public painelForm!: FormGroup
  hideRequiredControl = new FormControl(true);

  imagemPainelAtual: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataModal: any,
    public dialogRef: MatDialogRef<PainelModalComponent>,
    private fb: FormBuilder,
    private api:ApiService,
    private toast: ToastrService
  ){ }

  ngOnInit(): void {

    console.log(this.dataModal)

    this.api.getTemaListFull()
      .subscribe( (res:any) => {
        this.listaTemas = res;
      });

    this.painelForm = this.fb.group({
      nome:["",Validators.required]
      ,ativo:["",Validators.required]
      ,idTema:["",Validators.required]
      ,publico:["",Validators.required]
      ,url:["",Validators.required]
      ,reportID:["",Validators.required]
      ,workspaceID:["",Validators.required]
      ,fimDestaque:[]
      ,imagemPainel:[,Validators.required]
    })

    if (this.dataModal.action === "update"){ //se ação for 'update', seta valores no form
      this.painelForm.controls['nome'].setValue(this.dataModal.row.nome);
      this.painelForm.controls['ativo'].patchValue(this.dataModal.row.indAtivo);
      this.painelForm.controls['publico'].patchValue(this.dataModal.row.publico);
      this.painelForm.controls['idTema'].patchValue(this.dataModal.row.tema.id);
      this.painelForm.controls['url'].setValue(this.dataModal.row.url);
      this.painelForm.controls['reportID'].setValue(this.dataModal.row.reportId);
      this.painelForm.controls['workspaceID'].setValue(this.dataModal.row.workSpaceId);
      this.painelForm.controls['fimDestaque'].setValue(this.dataModal.row.fimDestaque);
      this.imagemPainelAtual = this.dataModal.row.imagemPainel;
    }

  }


  setPainel(){

    this.painelForm.value.ultAtualizacao = this.today;

    switch (this.dataModal.action) {
      case "add":
        this.adicionaPainel();
        break;
      case "update":
        this.alteraPainel();
        break;
      case "delete":
        this.deletaPainel();
        break;
    }

  }

  private erroPossuiMensagem(err: any) {
    return err && err.error;
  }

  private deletaPainel() {
    this.api.deletePainel(this.dataModal.row.idPainel)
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

  private alteraPainel() {
    this.painelForm.value.id = this.dataModal.row.idPainel;
    this.api.updatePainel(this.painelForm.value)
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

  private adicionaPainel() {
    this.painelForm.value.criacao = this.today;

    if (this.painelForm.invalid) {
      this.toast.error(MESSAGES.error.form.invalid)
      return
    }

    console.log("formValue", this.painelForm.value);

    this.api.addPainel(this.painelForm.value)
      .subscribe(res => {
        if (res) {
          this.toast.success(MESSAGES.success.form.regSuc);
          this.dialogRef.close();
        }
      });
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0] ?? null;
    this.painelForm.controls['imagemPainel'].setValue(selectedFile);
  }

}
