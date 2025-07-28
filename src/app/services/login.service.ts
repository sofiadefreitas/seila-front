import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { appSettings } from '../app.config';
import { Token } from '../models/token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${appSettings.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) { }

  entrar(login: string, senha: string): Observable<Token> {
    const objetoJS = { login, senha };
    return this.http.post<Token>(this.apiUrl, objetoJS);
  }

  salvarToken(token: string): void {
    localStorage.setItem("Token", token);
  }

  obterToken(): string {
    return localStorage.getItem("Token") || "";
  }

  sair(): void {
    localStorage.removeItem("Token");
  }

  extrairDadosToken(): any | null {
    const token = this.obterToken();
    if (!token) return null;
    try {
      const dadosToken = jwtDecode(token);
      return dadosToken;
    } catch (err) {
      return null;
    }
  }

  gerarCabecalhoHTTP() {
    const token = this.obterToken();
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
  }

  temAssinaturaAtiva() : boolean {
    const dadosToken = this.extrairDadosToken();
    return dadosToken ? dadosToken.assinaturaAtiva === true : false;
  }
}
