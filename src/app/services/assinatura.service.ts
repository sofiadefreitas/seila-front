import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./login.service";
import {Observable} from "rxjs";
import {Assinatura} from "../models/assinatura";
import {appSettings} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class AssinaturaService {
  private apiUrl = `${appSettings.apiBaseUrl}/assinaturas`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Assinatura[]> {
    return this.http.get<Assinatura[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(assinatura: Assinatura): Observable<Assinatura> {
    if (assinatura.id) {
      return this.http.put<Assinatura>(`${this.apiUrl}/${assinatura.id}`, assinatura, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Assinatura>(this.apiUrl, assinatura, this.loginService.gerarCabecalhoHTTP());
    }
  }

  cancelar(assinatura: Assinatura): Observable<Assinatura>{
    let assinaturaCancelada: Assinatura;
    assinaturaCancelada = new Assinatura();
    assinaturaCancelada.id = assinatura.id;
    assinaturaCancelada.ativa = false;
    assinaturaCancelada.dataInicio = assinatura.dataInicio;
    assinaturaCancelada.dataFim = new Date();
    assinaturaCancelada.idCliente = assinatura.idCliente;
    assinaturaCancelada.idPlano = assinatura.idPlano;

    return this.salvar(assinaturaCancelada);
  }

  buscarPorId(id: number): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  getByClienteId(clienteId: number): Observable<Assinatura[]> {
    const url = `${this.apiUrl}/cliente/${clienteId}`;
    return this.http.get<Assinatura[]>(url, this.loginService.gerarCabecalhoHTTP());
  }
}
