import {Plano} from "./plano";
import {Cliente} from "./cliente";

export class Assinatura {
  id?: number;
  ativa!: boolean;
  dataInicio!: Date;
  dataFim?: Date;
  idCliente!: number;
  cliente?: Cliente;
  idPlano!: number;
  plano?  : Plano;


}
