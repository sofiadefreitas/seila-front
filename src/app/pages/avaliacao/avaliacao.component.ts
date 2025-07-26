import { Component } from '@angular/core';
import {AvaliacaoService} from "../../services/avaliacao.service";
import {Avaliacao} from "../../models/avaliacao";
import {LoginService} from "../../services/login.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FilmeService} from "../../services/filme.service";
import {forkJoin} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Filme} from "../../models/filme";

@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    DatePipe
  ],
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.css'
})
export class AvaliacaoComponent {

  avaliacoes: Avaliacao[] = [];
  isLoading = true;

  constructor(
    private avaliacaoService: AvaliacaoService,
    private filmeService: FilmeService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.id) {
      const idCliente = dadosToken.id;

      const chamadas = {
        avaliacoes: this.avaliacaoService.getByClienteId(idCliente),
        filmes: this.filmeService.listar()
      }
      //
      // this.avaliacaoService.getByClienteId(idCliente).subscribe({
      //   next: (dados) => {
      //     this.avaliacoes = dados;
      //     this.isLoading = false;
      // //   },
      // error: (err) => {
      //   console.error('Erro ao carregar avaliações', err);
      //   this.isLoading = false;
      // }

      forkJoin(chamadas).subscribe({
        next: (resultado) => {
          const { avaliacoes, filmes } = resultado;

          // 2. ENRIQUEÇA OS DADOS: Anexe o objeto Filme a cada Avaliação
          this.avaliacoes = this.addFilmesNasAvaliacoes(avaliacoes, filmes);

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados de Avaliações e Filmes', err);
          this.isLoading = false;
        }
      });
    }  else {
      console.error('Token ou ID do cliente não encontrado ao iniciar o componente.');
      this.isLoading = false;
    }
  }

  private addFilmesNasAvaliacoes(avaliacoes: Avaliacao[], filmes: Filme[]): Avaliacao[] {
    const mapaDeFilmes = new Map<number, Filme>(filmes.map(f => [f.id!, f])); // Mapa de filmes para busca rápida (evita muitas consultas à API)

    avaliacoes.forEach(avaliacao => {
      if (avaliacao.idFilme) {
        avaliacao.filme = mapaDeFilmes.get(avaliacao.idFilme);
      }
    });

    return avaliacoes;
  }
}
