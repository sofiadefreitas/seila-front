import { Injectable } from '@angular/core';
import {forkJoin, map, Observable} from "rxjs";
import {MinhaConta} from "../models/minha-conta";
import {LoginService} from "./login.service";
import {ClienteService} from "./cliente.service";
import {AssinaturaService} from "./assinatura.service";
import {PlanoService} from "./plano.service";
import {Assinatura} from "../models/assinatura";
import {Plano} from "../models/plano";
import {PerfilService} from "./perfil.service";
import {GeneroService} from "./genero.service";
import {Perfil} from "../models/perfil";
import {Genero} from "../models/genero";

@Injectable({
  providedIn: 'root'
})
export class MinhaContaService {


  constructor(
    private loginService: LoginService,
    private clienteService: ClienteService,
    private assinaturaService: AssinaturaService,
    private planoService: PlanoService,
    private perfilService: PerfilService,
    private generoService: GeneroService) { }

  carregarDados(): Observable<MinhaConta> {
    const dadosToken = this.loginService.extrairDadosToken();

    if (!dadosToken || !dadosToken.id) {
      throw new Error('ID do cliente não encontrado no token.');
    }

    const idCliente = dadosToken.id;

    const chamadas = {
      cliente: this.clienteService.buscar(idCliente),
      assinaturas: this.assinaturaService.getByClienteId(idCliente),
      planos: this.planoService.listar(),
      perfis: this.perfilService.getPerfis(),
      todosOsGeneros: this.generoService.listar()
    };

    return forkJoin(chamadas).pipe(
      map(resultado => {
        const { cliente, assinaturas, planos, perfis, todosOsGeneros } = resultado;

        const perfisComDescricao = this.addDescricaoAosPerfis(perfis, todosOsGeneros);
        const assinaturasComPlanos = this.addPlanosAsAssinaturas(assinaturas, planos);

        return new MinhaConta(cliente, assinaturasComPlanos, perfisComDescricao);
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

  private addDescricaoAosPerfis(perfis: Perfil[], todosOsGeneros: Genero[]): Perfil[] {

    const mapaDeGeneros = new Map<number, string>(todosOsGeneros.map(g => [g.id!, g.descricao]));

    perfis.forEach(perfil => {
      const descricaoDoGenero = mapaDeGeneros.get(perfil.idGenero);

      if (descricaoDoGenero) {
        perfil.descricaoDoGenero = descricaoDoGenero;
      }
    });

    return perfis;
  }
}
