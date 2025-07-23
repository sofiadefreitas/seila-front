import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Filme} from "../models/filme";

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private apiUrl = 'http://localhost:8080/filmes';
  private apiGeneros = 'http://localhost:8080/generos'

  constructor(private http: HttpClient) { }

  listar(): Observable<Filme[]> {
    return this.http.get<Filme[]>(this.apiUrl);
  }

  buscar(id: number) {
    return this.http.get<Filme>(`${this.apiUrl}/${id}`);
  }

  getByGeneroId(idGenero: number): Observable<Filme[]> {
    const url = `${this.apiGeneros}/${idGenero}/filmes`;
    return this.http.get<Filme[]>(url);
  }
}
