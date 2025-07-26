import {Filme} from "./filme";
import {Cliente} from "./cliente";

export class Avaliacao {
  id?: number;
  data?: Date;
  comentario?: string;
  nota!: number;
  idFilme!: number;
  filme?: Filme;
  idCliente!: number;
  cliente!: Cliente;
}
