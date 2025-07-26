import { Component } from '@angular/core';
import {Genero} from "../../models/genero";
import {FilmeService} from "../../services/filme.service";
import {GeneroService} from "../../services/genero.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {Filme} from "../../models/filme";

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
  detalhesFilme?: Filme;

  constructor(private filmeService: FilmeService, private generoService: GeneroService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.carregarFilmesPorGenero();
    } else {
      this.filmeService.buscar(id).subscribe(
        resultado => {
          this.detalhesFilme = resultado;
        });
    }
  }

  carregarFilmesPorGenero() :void {
    this.generoService.listar().subscribe(
      generosApi => {
        this.generos = generosApi;
        this.generos.forEach(
          genero => {

            if (genero && genero.id) { // Verificação de segurança
              this.filmeService.getByGeneroId(genero.id).subscribe(
                filmesDoGenero => {
                  genero.filmes = filmesDoGenero; // Anexamos a lista de filmes ao objeto genero correspondente
                });

              // this.filmeService.getByGeneroId(genero.id!).subscribe(
              //   resultado => {
              //     this.filmes = resultado;
              //   });
            }
          });
      });
  }

}
