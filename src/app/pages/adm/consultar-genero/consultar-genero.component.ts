import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Genero} from "../../../models/genero";
import {Router} from "@angular/router";
import {GeneroService} from "../../../services/genero.service";

@Component({
  selector: 'app-consultar-genero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar-genero.component.html',
  styleUrl: './consultar-genero.component.css'
})
export class ConsultarGeneroComponent {

  generos: Genero[] = [];

  constructor(private generoService: GeneroService, private router: Router) {
  }

  ngOnInit() {
    this.carregarGeneros();
  }

  carregarGeneros(): void {
    this.generoService.listar().subscribe(
      generos => {
        this.generos = generos;
      }
    );
  }

  editarGenero(genero: Genero): void {
    this.router.navigate(['/adm/generos', genero.id]);
  }


}
