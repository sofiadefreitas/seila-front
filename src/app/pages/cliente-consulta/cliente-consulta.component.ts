import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Cliente} from "../../models/cliente";
import {PlanoService} from "../../services/plano.service";
import {Router} from "@angular/router";
import {ClienteService} from "../../services/cliente.service";

@Component({
  selector: 'app-cliente-consulta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-consulta.component.html',
  styleUrl: './cliente-consulta.component.css'
})
export class ClienteConsultaComponent {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService, private router: Router) {
  }

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.listar().subscribe(
      clientes => {
        this.clientes = clientes;
      }
    );
  }
}
