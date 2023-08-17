import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: any;

  constructor(private http: HttpClient) { }

  loadConfig() {
      return this.http
          .get("./assets/config.json")
          .toPromise()
          .then((data: any) => {
              this.config = data;
          });
  }

  get baseUrl() {
      if (!this.config) {
          throw Error("API não configurada.");
      }
      return this.config.baseUrl;
  }

  get urlSharedApi() {
      if (!this.config) {
          throw Error("API GAU não configurada.");
      }
      return this.config.urlSharedApi;
  }

  get secretKeyLogin() {
      if (!this.config) {
          throw Error("Chave de login.");
      }
      return this.config.secretKeyLogin;
  }

  get secretKeyGAU() {
      if (!this.config) {
          throw Error("Chave do GAU.");
      }
      return this.config.secretKeyGAU;
  }
}
