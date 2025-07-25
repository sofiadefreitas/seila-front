import {Cliente} from "./cliente";
import {Filme} from "./filme";

export class Historico {
  id?: number;
  data!: Date;
  filme!: Filme;
  cliente!: Cliente;
}
