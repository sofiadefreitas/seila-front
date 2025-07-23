import {Filme} from "./filme";

export class Genero {
  id?: number;
  descricao!: string;
  filmes?: Filme[];
}
