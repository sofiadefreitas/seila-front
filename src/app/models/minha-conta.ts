import {Assinatura} from "./assinatura";
import {Cliente} from "./cliente";

export class MinhaConta {
  id?: number;
  nome!: string;
  cpf!: string;
  email!: string;
  login!: string;
  assinaturaAtiva?: Assinatura;
  historicoAssinaturas?: Assinatura[];

  constructor(cliente: Cliente, assinaturas: Assinatura[]) {
    this.id = cliente.id;
    this.nome = cliente.nome;
    this.cpf = cliente.cpf;
    this.email = cliente.email;
    this.login = cliente.login;
    this.historicoAssinaturas = assinaturas;
    this.assinaturaAtiva = assinaturas.find(assinatura => assinatura.ativa);
  }
}
