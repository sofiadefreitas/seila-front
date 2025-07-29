import { Component } from '@angular/core';
import {AssinaturaService} from "../../services/assinatura.service";
import {LoginService} from "../../services/login.service";
import {Assinatura} from "../../models/assinatura";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {PlanoService} from "../../services/plano.service";
import {forkJoin} from "rxjs";
import {Plano} from "../../models/plano";

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
    private loginService: LoginService,
    private planoService: PlanoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.id) {
      const clienteId = dadosToken.id;

      const chamadas = {
        assinaturas: this.assinaturaService.getByClienteId(clienteId),
        planos: this.planoService.listar()
      };

      forkJoin(chamadas).subscribe({
        next: (resultado) => {
          const { assinaturas, planos } = resultado;

          this.assinaturas = this.addPlanosAsAssinaturas(assinaturas, planos);

          // Ordenar a lista da mais recente para a mais antiga
          this.assinaturas.sort((a, b) =>
            new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
          );

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados de assinatura:', err);
          this.isLoading = false;
        }
      });
    } else {
      console.error('ID do cliente não encontrado.');
      this.isLoading = false;
    }
  }

  private addPlanosAsAssinaturas(assinaturas: Assinatura[], planos: Plano[]): Assinatura[] {
    // Mapa de planos para busca rápida (evita muitas consultas à API)
    const mapaDePlanos = new Map<number, Plano>(planos.map(p => [p.id!, p]));

    assinaturas.forEach(assinatura => {
      if (assinatura.idPlano) {
        assinatura.plano = mapaDePlanos.get(assinatura.idPlano);
      }
    });

    return assinaturas;
  }
}
