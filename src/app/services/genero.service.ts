import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Genero} from "../models/genero";



@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private apiUrl = 'http://localhost:8080/generos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.apiUrl);
  }

  salvar(genero: Genero): Observable<Genero> {
    if (genero.id) {
      return this.http.put<Genero>(`${this.apiUrl}/${genero.id}`, genero);
    }
    else {
      return this.http.post<Genero>(this.apiUrl, genero);
    }
  }

  buscar(id: number) {
    return this.http.get<Genero>(`${this.apiUrl}/${id}`);
  }

  excluir(id: number) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
