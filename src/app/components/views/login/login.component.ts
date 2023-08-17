import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CredenciaisModel } from 'src/app/models/credenciais.model';
import { FuncionarioModel } from 'src/app/models/funcionario.model';
import { LocalStorage } from 'src/utils/constrains';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderactionsService } from 'src/app/services/headeractions.service';
export interface Subject {
  name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title       = "Entrar";
  description = "Efetuar login no sistema";
  user: string = '';
  pass: string = '';
  loginForm!: FormGroup;

  today = new Date();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private toast: ToastrService,
    private actions:HeaderactionsService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.reactiveForm()
  }

  reactiveForm() {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      pass: ['', [Validators.required]]
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.loginForm.controls[control].hasError(error);
  }

  submitForm() {
    const { user: usuario, pass: senha } = this.loginForm.value;

    this.authService.autenticar({usuario, senha} as CredenciaisModel)
      .then(res => {
        if (res.success) {
          const funcionario = res.data as FuncionarioModel;

          this.api.getUserByLogin(usuario)
            .subscribe(res => {
              if (res) {
                this.finnalyLogin(res, funcionario);
              } else {
                this.createUser(usuario, funcionario);
              }
            }, err => this.toast.error('Falha ao realizar buscar o usuário, por favor tente novamente'));

        } else {
          this.toast.error('Login ou senha inválidos, por favor revise os campos e as permissões do usuário');
        }
      })
      .catch(err => this.toast.error('Falha ao realizar login, por favor tente novamente'));
  }

  private createUser(usuario: any, funcionario: FuncionarioModel) {
    this.api.addUsuario({ login: usuario, ultAcesso: this.today })
      .subscribe(res => this.finnalyLogin(res, funcionario));
  }

  private finnalyLogin(res: any, funcionario: FuncionarioModel) {
    localStorage.setItem(LocalStorage.userId, res['id']);
    localStorage.setItem(LocalStorage.userProfile, res['perfil']);
    localStorage.setItem(LocalStorage.user, JSON.stringify(funcionario));
    localStorage.setItem(LocalStorage.token, funcionario.token);
    this.actions.trySendLogin();
    this.router.navigate(['home']);
  }
}
