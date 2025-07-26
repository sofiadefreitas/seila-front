import { Component } from '@angular/core';
import {Historico} from "../../models/historico";
import {HistoricoService} from "../../services/historico.service";
import {LoginService} from "../../services/login.service";
import {Router, RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FilmeService} from "../../services/filme.service";
import {forkJoin} from "rxjs";
import {Filme} from "../../models/filme";

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    DatePipe
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent {

  historico: Historico[] = [];
  isLoading = true;

  constructor(
    private historicoService: HistoricoService,
    private loginService: LoginService,
    private filmeService: FilmeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    const dadosToken = this.loginService.extrairDadosToken();

    if (!dadosToken || !dadosToken.id) {
      console.error('ID do cliente não encontrado. Não é possível carregar o histórico.');
      this.isLoading = false;
      return;
    } else {

      const idCliente = dadosToken.id;

      const chamadas = {
        historicos: this.historicoService.getByClienteId(idCliente),
        filmes: this.filmeService.listar()
      };

      forkJoin(chamadas).subscribe({
        next: (resultado) => {
          const { historicos, filmes } = resultado;

          this.historico = this.addFilmesNoHistorico(historicos, filmes);

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados do histórico de filmes', err);
          this.isLoading = false;
        }
      });
      }
  }

  private addFilmesNoHistorico(historicos: Historico[], filmes: Filme[]) : Historico[] {
    const mapaDeFilmes = new Map<number, Filme>(filmes.map(f => [f.id!, f])); // Mapa de filmes para busca rápida (evita muitas consultas à API)

    historicos.forEach(historico => {
      if (historico.idFilme) {
        historico.filme = mapaDeFilmes.get(historico.idFilme);
      }
    });

    return historicos;
  }

  removerDoHistorico(idHistorico: number): void {
    if (confirm('Tem certeza que deseja remover este filme do seu histórico?')) {
      this.historicoService.excluir(idHistorico).subscribe({
        next: () => {
          this.historico = this.historico.filter(item => item.id !== idHistorico);
          alert('Item removido do histórico com sucesso.');
        },
        error: (err) => {
          console.error('Erro ao remover item do histórico:', err);
          alert('Erro ao remover o registro. Tente novamente.');
        }
      });
    }
  }
}

