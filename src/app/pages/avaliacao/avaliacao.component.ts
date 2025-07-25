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
    const clienteId = this.loginService.extrairDadosToken().id;

    if (clienteId) {
      this.avaliacaoService.getByClienteId(clienteId).subscribe({
        next: (dados) => {
          this.avaliacoes = dados;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar avaliações', err);
          this.isLoading = false;
    }
      });
    }
  }
}
