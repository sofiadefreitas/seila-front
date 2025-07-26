import {Cliente} from "./cliente";
import {Filme} from "./filme";

export class Historico {
  id?: number;
  data!: Date;
  idFilme!: number;
  filme?: Filme;
  idCliente!: number;
  cliente?: Cliente;
}
