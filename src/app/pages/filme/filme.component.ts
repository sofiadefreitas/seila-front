import { Component } from '@angular/core';
import {Genero} from "../../models/genero";
import {FilmeService} from "../../services/filme.service";
import {GeneroService} from "../../services/genero.service";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-filme',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf
  ],
  templateUrl: './filme.component.html',
  styleUrl: './filme.component.css'
})
export class FilmeComponent {
  generos: Genero[] = [];

  constructor(private filmeService: FilmeService, private generoService: GeneroService, private router: Router) {
  }

  ngOnInit(): void {
    this.generoService.listar().subscribe(
      generosApi => {
        this.generos = generosApi;
        this.generos.forEach(genero => {
          this.filmeService.getByGeneroId(genero.id!).subscribe(
            filmesDoGenero => {
              genero.filmes = filmesDoGenero;
            });
        });
      });
  }

}
