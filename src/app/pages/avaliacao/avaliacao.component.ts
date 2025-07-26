import { Component } from '@angular/core';
import {AvaliacaoService} from "../../services/avaliacao.service";
import {Avaliacao} from "../../models/avaliacao";
import {LoginService} from "../../services/login.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

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
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.id) {
      const idCliente = dadosToken.id;
      this.avaliacaoService.getByClienteId(idCliente).subscribe({
        next: (dados) => {
          this.avaliacoes = dados;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar avaliações', err);
          this.isLoading = false;
    }
      });
    }  else {
      console.error('Token ou ID do cliente não encontrado ao iniciar o componente.');
      this.isLoading = false;
    }
  }
}
