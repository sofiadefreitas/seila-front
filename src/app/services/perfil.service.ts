import {Injectable} from '@angular/core';
import {appSettings} from "../app.config";
import {GeneroService} from "./genero.service";
import {LoginService} from "./login.service";
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";
import {Perfil} from "../models/perfil";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = `${appSettings.apiBaseUrl}/perfil`;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private generoService: GeneroService
  ) { }

  getPerfis() : Observable<Perfil[]> {
    const idCliente = this.loginService.extrairDadosToken()?.id;
    if (!idCliente) {
      throw new Error('ID do cliente não encontrado no token');
    } else
      return this.http.get<Perfil[]>(`${this.apiUrl}/cliente/${idCliente}`)
  }

  salvarPerfis(perfil: Perfil) : Observable<any> {
    const idCliente = this.loginService.extrairDadosToken()?.id;

    if (!idCliente) {
      throw new Error('ID do cliente não encontrado no token');
    } else {
      return this.http.post(this.apiUrl, perfil, this.loginService.gerarCabecalhoHTTP());
    }

  }

}
