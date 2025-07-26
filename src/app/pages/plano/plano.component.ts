import { Component } from '@angular/core';
import {CommonModule} from "@angular/common"
import {Router} from "@angular/router";
import {Plano} from "../../models/plano";
import {PlanoService} from "../../services/plano.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

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

  constructor(private planoService: PlanoService, private router: Router) {
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
    alert(`Você selecionou o plano ${plano.descricao} por R$ ${plano.valor}!`);
    this.router.navigate(['cadastro', plano.id!]);
  }
}
