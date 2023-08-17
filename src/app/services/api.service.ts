import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorage } from 'src/utils/constrains';
import { PERFIS } from 'src/utils/enums';
import { PainelFavoritoModel } from '../models/painel-favorito.model';
import { ConfigService } from './config.service';

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
    const userId = localStorage.getItem(LocalStorage.userId);
    const userProfile = localStorage.getItem(LocalStorage.userProfile);

    const headers = new HttpHeaders({ 'isAdmin': (Number(userProfile) == PERFIS.ADMIN) ? 'true' : 'false' });

    return this.http.get<any>(`${this._apiUrl}/lista/modulos/${userId}`, {headers});
  }

  getModulosListaSimples():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/modulos/simples`);
  }
  getModulosLista():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/modulos/todos`);
  }

  getPaineisList():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/paineis`)
  }

  getPainel(workspaceId: any, reportId: any):Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/embedinfo/${workspaceId}/${reportId}`);
  }

  getPainelPorTema(idTema):Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/busca/tema/paineis/${idTema}`);
  }

  getPainelAcesso(idUsuario):Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/permissoes/${idUsuario}`);
  }
  getTemaAcesso(idUsuario):Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/permissoesgestor/${idUsuario}`);
  }

  addPermissao(permissao):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/permissao/adicionar', permissao);
  }

  addPermissaoGestor(permissao):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/permissaogestor/adicionar', permissao);
  }

  deletePermissao(permissao:any){
    return this.http.delete<any>(this._apiUrl + '/lista/permissao/deletar', { body: permissao });
  }

  getTemaListFull():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/temas`);
  }

  listaUsuarios():Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/usuarios`);
  }

  getUserByLogin(login:any):Observable<any[]>{
    return this.http.get<any>(this._apiUrl + `/lista/busca/usuario/${login}`);
  }

  addUsuario(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/usuario/adicionar', body);
  }

  updateUsuario(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + `/lista/usuario/atualizar/${body.idUsuario}`, body);
  }

  deleteUsuario(id:number){
    return this.http.delete<any>(this._apiUrl + `/lista/usuario/deletar/${id}`);
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
    return this.http.post<any>(this._apiUrl + `/lista/tema/atualizar/${body.id}`, body );
  }

  deleteTema(id:number){
    return this.http.delete<any>(this._apiUrl + `/lista/tema/deletar/${id}`);
  }

  addPainel(body:any):Observable<any[]>{
    const form: FormData = new FormData();
    form.append('File', body.imagemPainel);
    delete body.imagemPainel;
    form.append('json', JSON.stringify(body));

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post<any>(this._apiUrl + '/lista/painel/adicionar', form, {headers});
  }

  updatePainel(body:any):Observable<any[]>{
    const form: FormData = new FormData();
    form.append('File', body.imagemPainel);
    delete body.imagemPainel;
    form.append('json', JSON.stringify(body));

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post<any>(this._apiUrl + `/lista/painel/atualizar/${body.id}`, form, {headers});
  }

  deletePainel(id:number){
    return this.http.delete<any>(this._apiUrl + `/lista/painel/deletar/${id}`);
  }

  favoriteList(idUsuario){
    return this.http.get<any>(this._apiUrl + `/lista/paineis/favoritos/${idUsuario}`);
  }

  favoriteListUser(): Observable<PainelFavoritoModel[]>{
    const idUsuario = localStorage.getItem(LocalStorage.userId);

    return this.http.get<any>(this._apiUrl + `/lista/paineis/favoritos/usuario/${idUsuario}`);
  }

  highlightListUser(): Observable<PainelFavoritoModel[]>{
    const idUsuario = localStorage.getItem(LocalStorage.userId);
    const userProfile = localStorage.getItem(LocalStorage.userProfile);

    const headers = new HttpHeaders({ 'isAdmin': (Number(userProfile) == PERFIS.ADMIN) ? 'true' : 'false' });

    return this.http.get<any>(this._apiUrl + `/lista/paineis/destaques/usuario/${idUsuario}`, { headers });
  }

  favorite(body:any):Observable<any[]>{
    return this.http.post<any>(this._apiUrl + '/lista/favorito/adicionar', body );
  }

  unfavorite(body:any){
    return this.http.delete<any>(this._apiUrl + '/lista/favorito/deletar', {body: body});
  }

}
