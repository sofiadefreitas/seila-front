import { Component } from '@angular/core';
import {CommonModule} from "@angular/common"
import {Router} from "@angular/router";
import {Plano} from "../../models/plano";
import {PlanoService} from "../../services/plano.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {AssinaturaService} from "../../services/assinatura.service";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plano.component.html',
  styleUrl: './plano.component.css'
})
export class PlanoComponent {
  planos: Plano[] = [];
  isLoading = true;

  constructor(
    private planoService: PlanoService,
    private assinaturaService: AssinaturaService,
    private loginService: LoginService,
    private router: Router) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.carregarPlanos();
  }

  carregarPlanos(): void {
    this.planoService.listar().subscribe({
      next: planos => {
        this.planos = planos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar os planos:', err);
        this.isLoading = false;
      }
    });
  }

  selecionarPlano(plano: Plano) {
    const idCliente = this.loginService.extrairDadosToken()?.id;
    const idPlano = plano.id;

    if (!idCliente) {
      localStorage.setItem('idPlanoEscolhido', idPlano!.toString());

      alert('Para assinar, você precisa criar uma conta.');
      this.router.navigate(['/cadastro']);
      return;
    } else { // usuário logado
      // Cria o objeto de nova assinatura
      const novaAssinatura = {
        idPlano: idPlano,
        idCliente: idCliente,
        dataInicio: new Date(),
        ativa: true
      };

      this.assinaturaService.salvar(novaAssinatura as any).subscribe({
        next: () => {
          this.loginService.sair(); // força o logout para limpar o token antigo com assinaturaAtiva = false
          alert('Assinatura realizada com sucesso! Por favor, faça o login novamente para ativar seu plano e aproveitar nosso catálogo.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro ao criar assinatura:', err);
          alert('Não foi possível processar sua assinatura. Tente novamente.');
        }
      });

    }


  }
}
