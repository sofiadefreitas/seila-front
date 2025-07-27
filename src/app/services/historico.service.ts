import { Injectable } from '@angular/core';
import {appSettings} from "../app.config";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./login.service";
import {Observable} from "rxjs";
import {Historico} from "../models/historico";

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  private apiUrl = `${appSettings.apiBaseUrl}/historico`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  // listar(): Observable<Historico[]> {
  //   return this.http.get<Historico[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  // }

  salvar(historico: Historico): Observable<Historico> {
    return this.http.post<Historico>(this.apiUrl, historico, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  getByClienteId(clienteId: number): Observable<Historico[]> {
    const url = `${this.apiUrl}/cliente/${clienteId}`;
    return this.http.get<Historico[]>(url, this.loginService.gerarCabecalhoHTTP());
  }
}
