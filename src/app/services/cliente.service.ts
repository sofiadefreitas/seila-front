import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Plano} from "../models/plano";
import {Cliente} from "../models/cliente";
import {Genero} from "../models/genero";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) { }

  buscar(id: number) {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  salvar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl,
                                    {...cliente,
                                      nivelAcesso: 'CLIENTE'});
    // ...cliente copia todos os atributos do objeto cliente, mas é preciso adicionar o nivel (que não existe no front)
  }

}
