import { Component } from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {PerfilService} from "../../services/perfil.service";
import {Genero} from "../../models/genero";
import {Historico} from "../../models/historico";
import {FilmeService} from "../../services/filme.service";
import {HistoricoService} from "../../services/historico.service";
import {GeneroService} from "../../services/genero.service";
import {LoginService} from "../../services/login.service";
import {forkJoin} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {Filme} from "../../models/filme";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  generosPreferidosComFilmes: Genero[] = [];
  historicoParaExibir: Historico[] = [];
  isLoading = true;

  constructor(
    private perfilService: PerfilService,
    private filmeService: FilmeService,
    private historicoService: HistoricoService,
    private generoService: GeneroService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const dadosToken = this.loginService.extrairDadosToken();

    if (!dadosToken || !dadosToken.id) {
      this.router.navigate(['/filmes']);
      return;
    }

    const idCliente = dadosToken.id;
    this.carregarConteudoPersonalizado(idCliente);
  }

  carregarConteudoPersonalizado(idCliente: number): void {
    const chamadas = {
      perfis: this.perfilService.getPerfis(),
      historico: this.historicoService.getByClienteId(idCliente),
      todosOsGeneros: this.generoService.listar(),
      todosOsFilmes: this.filmeService.listar()
    };

    forkJoin(chamadas).subscribe({
      next: (resultado) => {
        const { perfis, historico, todosOsGeneros, todosOsFilmes } = resultado;

        const historicoComFilmes = this.addFilmesAoHistorico(historico, todosOsFilmes);
        this.historicoParaExibir = historico.slice(0, 6);

        const generosPreferidosMap = new Map<number, boolean>();
        perfis.forEach(p => generosPreferidosMap.set(p.idGenero, p.gostaDoGenero));

        // Filtra a lista de TODOS os gêneros para pegar apenas os que o usuário GOSTA (true)
        this.generosPreferidosComFilmes = todosOsGeneros.filter(genero =>
          generosPreferidosMap.get(genero.id!) === true
        );

        // Para cada gênero preferido, busca os filmes
        this.generosPreferidosComFilmes.forEach(genero => {
          this.filmeService.getByGeneroId(genero.id!).subscribe(filmes => {
            genero.filmes = filmes;
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar conteúdo personalizado:', err);
        this.isLoading = false;
      }
    });
  }

  private addFilmesAoHistorico(historico: Historico[], todosOsFilmes: Filme[]) {
    const mapaDeFilmes = new Map<number, Filme>(todosOsFilmes.map(f => [f.id!, f]));

    historico.forEach(item => {
      if (item.idFilme) {
        item.filme = mapaDeFilmes.get(item.idFilme);
      }
    });

    return historico;
  }
}

