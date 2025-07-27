export class Perfil {
  id?: number;
  idGenero!: number;
  idCliente!: number;
  gostaDoGenero!: boolean;
  descricaoDoGenero?: string;

  constructor(idGenero: number, idCliente: number, gostaDoGenero: boolean) {
    this.idGenero = idGenero;
    this.idCliente = idCliente;
    this.gostaDoGenero = gostaDoGenero;
  }
}
