import { Component } from '@angular/core';
import {MinhaContaService} from "../../services/minha-conta.service";
import {MinhaConta} from "../../models/minha-conta";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './minha-conta.component.html',
  styleUrl: './minha-conta.component.css'
})
export class MinhaContaComponent {

  dadosConta?: MinhaConta;
  isLoading = true; // Flag para controlar o spinner de carregamento

  constructor(private minhaContaService: MinhaContaService) { }

  ngOnInit(): void {
    this.minhaContaService.carregarDados().subscribe({
      next: (dados) => {
        this.dadosConta = dados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados da conta', err);
        this.isLoading = false;
      }
    });
  }
}
