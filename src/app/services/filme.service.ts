import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Filme} from "../models/filme";
import {FilmeGenero} from "../models/filme-genero";
import {Genero} from "../models/genero";
import {appSettings} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private apiUrl = `${appSettings.apiBaseUrl}/filmes`;
  private apiGeneros = `${appSettings.apiBaseUrl}/generos`;

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

  getGenerosDoFilme(idFilme: number): Observable<Genero[]> {
    const url = `${this.apiUrl}/${idFilme}/generos`;
    return this.http.get<Genero[]>(url);
  }
}
