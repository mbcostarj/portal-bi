import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from './services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http:HttpClient,
    private config: ConfigService) { }

  get _apiUrl() {
    return this.config.baseUrl;
  }

  getPainelList():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + '/listar');
  }

  getPainel(workspaceId: any, reportId: any):Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/embedinfo/${workspaceId}/${reportId}`);
  }

  getModulosListaSimples():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + '/lista/modulos/simples');
  }

  addModulo(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/modulo/adicionar', body );
  }

  updateModulo(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + `/lista/modulo/atualizar/${body.idModulo}`, body );
  }

  deleteModulo(id:number){
    return this.http.delete<any>(this._apiUrl + `/lista/modulo/deletar/${id}`);
  }

  addTema(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/tema/adicionar', body );
  }

  updateTema(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + `/lista/tema/atualizar/${body.idModulo}`, body );
  }

  deleteTema(id:number){
    return this.http.delete<any>(this._apiUrl + `/lista/tema/deletar/${id}`);
  }

  addPainel(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/painel/adicionar', body );
  }

  updatePainel(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + `/lista/painel/atualizar/${body.idModulo}`, body );
  }

  deletePainel(id:number){
    return this.http.delete<any>(this._apiUrl + `/lista/painel/deletar/${id}`);
  }

}
