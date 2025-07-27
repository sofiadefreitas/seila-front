import { Component } from '@angular/core';
import {Perfil} from "../../models/perfil";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {PerfilService} from "../../services/perfil.service";
import {NgForOf, NgIf} from "@angular/common";
import {Genero} from "../../models/genero";
import {GeneroService} from "../../services/genero.service";
import {LoginService} from "../../services/login.service";
import {forkJoin, Observable} from "rxjs";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  form: FormGroup;
  perfisSalvos: Perfil[] = [];
  todosOsGeneros: Genero[] = [];
  isLoading = true;

  constructor(private perfilService: PerfilService, private fb: FormBuilder, private generoService: GeneroService, private loginService: LoginService) {
    this.form = this.fb.group({
      perfis: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    const chamadas = {
      generos: this.generoService.listar(),
      perfis: this.perfilService.getPerfis()
    };

    forkJoin(chamadas).subscribe({
      next: (resultado) => {
        this.todosOsGeneros = resultado.generos;
        this.perfisSalvos = resultado.perfis;
        this.criarCheckboxes();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do perfil', err);
        this.isLoading = false;
      }
    });
  }

  get perfisFormArray() {
    return this.form.controls['perfis'] as FormArray;
  }

// Para cada preferência, adicione um novo FormControl ao FormArray
  private criarCheckboxes() {
    // Para cada gênero disponível, determinar se ele está marcado
    this.todosOsGeneros.forEach(genero => {
      // Procuramos na lista de perfis salvos se existe um perfil para este gênero
      const perfil = this.perfisSalvos.find(p => p.idGenero === genero.id);

      const valorInicial = !!perfil; // O valor inicial do checkbox é 'true' se um perfil existir, senão 'false'

      this.perfisFormArray.push(new FormControl(valorInicial));
    });
  }

  onSubmit(): void {
    const formValues = this.perfisFormArray.value;
    const idCliente = this.loginService.extrairDadosToken()?.id;
    if (!idCliente) {
      alert('Erro de autenticação.');
      return;
    }

    const chamadasDeApi: Observable<any>[] = [];

    this.todosOsGeneros.forEach((genero, i) => {
      const gosta = formValues[i];
      const perfilExistente = this.perfisSalvos.find(p => p.idGenero === genero.id);

      const perfilParaSalvar: Perfil = {
        id: perfilExistente?.id,
        idGenero: genero.id!,
        idCliente: idCliente,
        gostaDoGenero: gosta
      };
      chamadasDeApi.push(this.perfilService.salvarPerfis(perfilParaSalvar));

    });

    if (chamadasDeApi.length === 0) {
      alert('Preferências salvas (nenhuma alteração necessária).');
      return;
    }

    forkJoin(chamadasDeApi).subscribe({
      next: () => {
        alert('Todas as suas preferências foram salvas com sucesso!');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Ocorreu um erro ao salvar uma ou mais preferências:', err);
        alert('Não foi possível salvar todas as suas preferências. Tente novamente.');
      }
    });
    }

}
