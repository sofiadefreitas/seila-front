import { Component } from '@angular/core';
import {CommonModule} from "@angular/common"
import {Router} from "@angular/router";
import {Plano} from "../../models/plano";
import {PlanoService} from "../../services/plano.service";

@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plano.component.html',
  styleUrl: './plano.component.css'
})
export class PlanoComponent {
  planos: Plano[] = [];

  constructor(private planoService: PlanoService, private router: Router) {
  }

  ngOnInit() {
    this.carregarPlanos();
  }

  carregarPlanos(): void {
    this.planoService.listar().subscribe(
      planos => {
        this.planos = planos;
      }
    );
  }
}
