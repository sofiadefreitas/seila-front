import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Plano} from "../models/plano"

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  private apiUrl = 'http://localhost:8080/planos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Plano[]> {
    return this.http.get<Plano[]>(this.apiUrl);
  }

  buscar(id: number) {
    return this.http.get<Plano>(`${this.apiUrl}/${id}`);
  }
}
