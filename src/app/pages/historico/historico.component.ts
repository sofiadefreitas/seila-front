import { Component } from '@angular/core';
import {Historico} from "../../models/historico";
import {HistoricoService} from "../../services/historico.service";
import {LoginService} from "../../services/login.service";
import {Router, RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    const dadosToken = this.loginService.extrairDadosToken();

    if (!dadosToken || !dadosToken.id) {
      console.error('ID do cliente não encontrado. Não é possível carregar o histórico.');
      this.isLoading = false;
      return;
    }

    const clienteId = dadosToken.id;

    this.historicoService.getByClienteId(clienteId).subscribe({
      next: (dados) => {
        this.historico = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar o histórico:', err);
        alert('Não foi possível carregar seu histórico. Tente novamente mais tarde.');
        this.isLoading = false;
      }
    });
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

