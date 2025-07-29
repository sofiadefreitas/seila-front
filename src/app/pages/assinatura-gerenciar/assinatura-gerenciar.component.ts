import { Component } from '@angular/core';
import {Assinatura} from "../../models/assinatura";
import {Plano} from "../../models/plano";
import {Router} from "@angular/router";
import {AssinaturaService} from "../../services/assinatura.service";
import {PlanoService} from "../../services/plano.service";
import {LoginService} from "../../services/login.service";
import {forkJoin} from "rxjs";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-assinatura-gerenciar',
  standalone: true,
  imports: [
    NgIf,
    DecimalPipe,
    DatePipe,
    FormsModule,
    NgForOf
  ],
  templateUrl: './assinatura-gerenciar.component.html',
  styleUrl: './assinatura-gerenciar.component.css'
})
export class AssinaturaGerenciarComponent {
  assinaturaAtiva?: Assinatura;
  outrosPlanos: Plano[] = []; // Planos disponíveis para troca
  isLoading = true;
  idNovoPlano?: number;

  constructor(
    private assinaturaService: AssinaturaService,
    private planoService: PlanoService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const idCliente = this.loginService.extrairDadosToken()?.id;
    if (!idCliente) {
      console.error('ID do cliente não encontrado.');
      this.isLoading = false;
      return;
    }

    const chamadas = {
      assinaturas: this.assinaturaService.getByClienteId(idCliente),
      todosOsPlanos: this.planoService.listar()
    };

    forkJoin(chamadas).subscribe({
      next: ({ assinaturas, todosOsPlanos }) => {
        this.assinaturaAtiva = assinaturas.find(a => a.ativa);
        if (this.assinaturaAtiva) {
          this.assinaturaAtiva.plano = todosOsPlanos.find(p => p.id === this.assinaturaAtiva!.idPlano);
        }

        // Filtra a lista de planos para mostrar apenas os que são diferentes do atual
        this.outrosPlanos = todosOsPlanos.filter(p => p.id !== this.assinaturaAtiva?.plano?.id);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados da assinatura:', err);
        this.isLoading = false;
      }
    });
  }

  trocarPlano(): void {
    if (!this.idNovoPlano || !this.assinaturaAtiva) {
      alert('Por favor, selecione um novo plano.');
      return;
    }

    if (confirm('Tem certeza que deseja trocar seu plano? A mudança será aplicada imediatamente.')) {
      const assinaturaAtualizada = {
        ...this.assinaturaAtiva,
        idPlano: this.idNovoPlano
      };

      this.assinaturaService.salvar(assinaturaAtualizada).subscribe({
        next: () => {
          alert('Plano alterado com sucesso! Por favor, faça o login novamente para atualizar sua sessão.');
          this.loginService.sair();
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Erro ao trocar de plano:', err)
      });
    }
  }

  cancelar(): void {
    if (!this.assinaturaAtiva?.id) return;

    if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      this.assinaturaService.cancelar(this.assinaturaAtiva).subscribe({
        next: () => {
          alert('Sua assinatura foi cancelada. Sentiremos sua falta.');
          this.loginService.sair();
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Erro ao cancelar assinatura:', err)
      });
    }
  }
}
