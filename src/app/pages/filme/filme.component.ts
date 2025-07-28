import { Component } from '@angular/core';
import {Genero} from "../../models/genero";
import {FilmeService} from "../../services/filme.service";
import {GeneroService} from "../../services/genero.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {Filme} from "../../models/filme";
import {SafeUrlPipe} from "../../pipes/safe-url.pipe";
import {LoginService} from "../../services/login.service";
import {HistoricoService} from "../../services/historico.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {forkJoin} from "rxjs";

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
  playerVideo = false;

  constructor(
    private filmeService: FilmeService,
    private generoService: GeneroService,
    protected loginService: LoginService,
    private historicoService: HistoricoService,
    private router: Router,
    private route: ActivatedRoute)
  { }

  ngOnInit(): void {
    let id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.carregarFilmesPorGenero();
    } else {
      if (this.loginService.obterToken()) {

        const chamadas = {
          filme: this.filmeService.buscar(id),
          generos: this.filmeService.getGenerosDoFilme(id)
        };

        forkJoin(chamadas).subscribe({
          next: (resultado) => {
            const { filme, generos } = resultado;

            this.detalhesFilme = filme;
            this.detalhesFilme.generos = generos;
            this.urlVideo = this.urlEmbed(this.detalhesFilme.urlVideo);
          },
          error: (err) => {
            console.error('Erro ao carregar dados do filme');
          }
        });

        // this.filmeService.buscar(id).subscribe(
        //   resultado => {
        //     this.detalhesFilme = resultado;
        //     this.urlVideo = this.urlEmbed(this.detalhesFilme.urlVideo);
        //   });

      } else { // não é usuário logado
        alert('Você precisa estar logado para ver detalhes do filme.');
        this.router.navigate(['/login']);
      }

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

  assistirTrailer() : void {
    if (!this.loginService.temAssinaturaAtiva()) {
      alert('Você precisa de uma assinatura ativa para assistir o trailer.');
      this.router.navigate(['/planos']);
      return;
    }

    const dadosToken = this.loginService.extrairDadosToken();
    if (!dadosToken || !dadosToken.id) {
      alert('Ocorreu um erro com sua autenticação. Por favor, faça o login novamente.');
      this.router.navigate(['/login']);
      return;
    }

    this.playerVideo = true;
    const novoHistorico = {
      data: new Date(),
      idFilme: this.detalhesFilme!.id,
      idCliente: dadosToken.id
    };

    this.historicoService.salvar(novoHistorico as any).subscribe({
      next: () => {
        console.log('Filme adicionado ao histórico com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao registrar no histórico:', err);
      }
    });
  }
}
