import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Filme} from "../../models/filme";
import {AvaliacaoService} from "../../services/avaliacao.service";
import {LoginService} from "../../services/login.service";
import {FilmeService} from "../../services/filme.service";
import {Avaliacao} from "../../models/avaliacao";

@Component({
  selector: 'app-avaliacao-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './avaliacao-cadastro.component.html',
  styleUrl: './avaliacao-cadastro.component.css'
})
export class AvaliacaoCadastroComponent {

  formGroup: FormGroup;
  idFilme!: number;
  filme!: Filme;

  constructor(private formBuilder: FormBuilder, private avaliacaoService: AvaliacaoService, private loginService: LoginService, private filmeService: FilmeService, private route: ActivatedRoute, private router: Router) {
    this.formGroup = this.formBuilder.group({
      // Usamos '5' como nota padrão
      nota: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idFilme');

    if (idParam) {
      this.idFilme = +idParam;
      this.carregarFilme();
    } else {
      console.error('Nenhum ID de filme foi fornecido para avaliação.');
      this.router.navigate(['/historico']);
    }
  }

  private carregarFilme() {
    this.filmeService.buscar(this.idFilme).subscribe(filme => {
      this.filme = filme;
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const dadosToken = this.loginService.extrairDadosToken();

      if (!dadosToken && !dadosToken.id) {
        alert('Erro de autenticação. Por favor, faça login novamente.');
        return;
      }

      const idCliente: number = dadosToken.id;

      const novaAvaliacao = {
        data: new Date(),
        comentario: this.formGroup.value.comentario,
        nota: this.formGroup.value.nota,
        idFilme: this.idFilme,
        idCliente: idCliente
      };

      this.avaliacaoService.salvar(novaAvaliacao as Avaliacao).subscribe({
        next: () => {
          alert('Avaliação salva com sucesso!');
          this.router.navigate(['/avaliacoes']);
        },
        error: (err) => {
          console.error('Erro ao salvar avaliação:', err);
          alert('Não foi possível salvar sua avaliação. Tente novamente.');
        }
      });
    }
  }
}
