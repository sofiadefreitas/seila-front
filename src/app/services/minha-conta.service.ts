import { Injectable } from '@angular/core';
import {forkJoin, map, Observable} from "rxjs";
import {MinhaConta} from "../models/minha-conta";
import {LoginService} from "./login.service";
import {ClienteService} from "./cliente.service";
import {AssinaturaService} from "./assinatura.service";
import {PlanoService} from "./plano.service";
import {Assinatura} from "../models/assinatura";
import {Plano} from "../models/plano";

@Injectable({
  providedIn: 'root'
})
export class MinhaContaService {


  constructor(
    private loginService: LoginService,
    private clienteService: ClienteService,
    private assinaturaService: AssinaturaService,
    private planoService: PlanoService) { }

  carregarDados(): Observable<MinhaConta> {
    const dadosToken = this.loginService.extrairDadosToken();

    if (!dadosToken || !dadosToken.id) {
      throw new Error('ID do cliente não encontrado no token.');
    }

    const idCliente = dadosToken.id;

    const chamadas = {
      cliente: this.clienteService.buscar(idCliente),
      assinaturas: this.assinaturaService.getByClienteId(idCliente),
      planos: this.planoService.listar()
    };

    return forkJoin(chamadas).pipe(
      map(resultado => {
        const { cliente, assinaturas, planos } = resultado;
        const assinaturasComPlanos = this.addPlanosAsAssinaturas(assinaturas, planos);

        // O construtor de MinhaConta fará o resto (encontrar a assinatura ativa, etc.)
        return new MinhaConta(cliente, assinaturasComPlanos);
      })
    );
  }

  private addPlanosAsAssinaturas(assinaturas: Assinatura[], planos: Plano[]) : Assinatura[] {
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
