import { Component } from '@angular/core';
import {AssinaturaService} from "../../services/assinatura.service";
import {LoginService} from "../../services/login.service";
import {Assinatura} from "../../models/assinatura";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-assinatura',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    DatePipe,
    NgForOf
  ],
  templateUrl: './assinatura.component.html',
  styleUrl: './assinatura.component.css'
})
export class AssinaturaComponent {

  assinaturas: Assinatura[] = [];
  isLoading = true;

  constructor(
    private assinaturaService: AssinaturaService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.id) {
      const clienteId = dadosToken.id;

      this.assinaturaService.getByClienteId(clienteId).subscribe({
        next: (dados) => {
          this.assinaturas = dados.sort((a, b) =>
            new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
          );
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar o histórico de assinaturas:', err);
          this.isLoading = false;
        }
      });
    } else {
      console.error('ID do cliente não encontrado.');
      this.isLoading = false;
    }
  }
}
