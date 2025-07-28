import {Genero} from "./genero";

export class Filme {
  id?: number;
  nome!: string;
  sinopse?: string;
  tags?: string;
  urlVideo!: string;
  urlImagem!: string;
  generos: Genero[] = [];
}
