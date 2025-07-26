import {Plano} from "./plano";
import {Cliente} from "./cliente";

export class Assinatura {
  id?: number;
  ativa!: boolean;
  dataInicio!: Date;
  dataFim?: Date;
  cliente!: Cliente;
  idPlano!: number;
  plano?: Plano;

}
