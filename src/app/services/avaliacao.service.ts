import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./login.service";
import {Avaliacao} from "../models/avaliacao";
import {Assinatura} from "../models/assinatura";
import {appSettings} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private apiUrl = `${appSettings.apiBaseUrl}/avaliacoes`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  // listar(): Observable<Avaliacao[]> {
  //   return this.http.get<Avaliacao[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  // }

  salvar(avaliacao: Avaliacao): Observable<Avaliacao> {
    if (avaliacao.id) {
      return this.http.put<Avaliacao>(`${this.apiUrl}/${avaliacao.id}`, avaliacao, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Avaliacao>(this.apiUrl, avaliacao, this.loginService.gerarCabecalhoHTTP());
    }
  }

  // buscarPorId(id: number): Observable<Avaliacao> {
  //   return this.http.get<Avaliacao>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  // }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  getByClienteId(clienteId: number): Observable<Avaliacao[]> {
    const url = `${this.apiUrl}/cliente/${clienteId}`;
    return this.http.get<Avaliacao[]>(url, this.loginService.gerarCabecalhoHTTP());
  }
}
