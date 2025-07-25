import { Injectable } from '@angular/core';
import {forkJoin, map, Observable} from "rxjs";
import {MinhaConta} from "../models/minha-conta";
import {LoginService} from "./login.service";
import {ClienteService} from "./cliente.service";
import {AssinaturaService} from "./assinatura.service";

@Injectable({
  providedIn: 'root'
})
export class MinhaContaService {


  constructor(
    private loginService: LoginService,
    private clienteService: ClienteService,
    private assinaturaService: AssinaturaService) { }

  carregarDados(): Observable<MinhaConta> {
    const idCliente = this.loginService.extrairDadosToken().id;

    const chamadas = {
      cliente: this.clienteService.buscar(idCliente),
      assinaturas: this.assinaturaService.getByClienteId(idCliente)
    };

    return forkJoin(chamadas).pipe(
      map(resultado => {
        const {cliente, assinaturas} = resultado;
        return new MinhaConta(cliente, assinaturas);
      })
    )
  }
}
