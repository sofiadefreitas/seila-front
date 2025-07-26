import { Component } from '@angular/core';
import {Genero} from "../../models/genero";
import {FilmeService} from "../../services/filme.service";
import {GeneroService} from "../../services/genero.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {Filme} from "../../models/filme";
import {SafeUrlPipe} from "../../pipes/safe-url.pipe";

@Component({
  selector: 'app-filme',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    SafeUrlPipe
  ],
  templateUrl: './filme.component.html',
  styleUrl: './filme.component.css'
})
export class FilmeComponent {
  generos: Genero[] = [];
  detalhesFilme?: Filme;
  urlVideo?: string;

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
          this.urlVideo = this.urlEmbed(this.detalhesFilme.urlVideo);
        });

      // if (this.detalhesFilme?.urlVideo) {
      //
      // }
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
            }
          });
      });
  }

  // modifica a url da API para uma url de vídeo para embedding no iframe
  private urlEmbed(urlApi: string): string {
    const videoIdMatch = urlApi.match(/[?&]v=([^&]+)/);

    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    console.error("URL do YouTube inválida:", urlApi);
    return ''; // Se não for um link do YouTube válido, retorne uma string vazia para não quebrar
  }
}
