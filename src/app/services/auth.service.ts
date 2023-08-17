import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuncionarioApi, LocalStorage } from 'src/utils/constrains';
import { RenovarToken } from 'src/utils/renovar-token';
import { CredenciaisModel } from '../models/credenciais.model';
import { FuncionarioModel } from '../models/funcionario.model';
import { RespostaHttp } from '../models/resposta-http.model';
import { ConfigService } from './config.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    protected configService: ConfigService,
    protected http: HttpClient
  ) { }

  autenticar(credencial: CredenciaisModel): Promise<RespostaHttp> {
    credencial.codigoSistema = 'SISPBI';
    credencial.senha = this.encryp(credencial.senha);
    return this.http
        .post<RespostaHttp>(this.configService.urlSharedApi + FuncionarioApi.autenticar, credencial)
        .toPromise();
  }

  async renovarToken(): Promise<RespostaHttp> {
    const funcionario = JSON.parse(localStorage.getItem(LocalStorage.user));
    if (funcionario?.login) {
        const renovarToken = new RenovarToken(funcionario.login);

        return await this.http
            .post<RespostaHttp>(
              this.configService.urlSharedApi + FuncionarioApi.renovarToken,
              renovarToken
            )
            .toPromise()
            .then(response => {
                if (response.success) {
                    let novoToken = response.data as FuncionarioModel;

                    funcionario.token = novoToken;

                    localStorage.setItem(LocalStorage.user, JSON.stringify(funcionario));
                    localStorage.setItem(LocalStorage.token, funcionario.token);
                }
                return response;
            });
    }
  }

  logout() {
    localStorage.removeItem(LocalStorage.user);
    localStorage.removeItem(LocalStorage.token);
  }

  private encryp(valor) {
    let secretKey = this.configService.secretKeyLogin;
    let key = CryptoJS.enc.Utf8.parse(secretKey);
    let iv = CryptoJS.enc.Utf8.parse(secretKey);

    let settings = {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };

    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(valor), key, settings).toString();
  }
}
