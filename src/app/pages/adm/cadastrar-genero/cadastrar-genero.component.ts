import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {GeneroService} from "../../../services/genero.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-cadastrar-genero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-genero.component.html',
  styleUrl: './cadastrar-genero.component.css'
})
export class CadastrarGeneroComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, private generoService: GeneroService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      id: [''],
      descricao: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.generoService.buscar(id).subscribe(
        genero => {this.form.patchValue(genero);}
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.generoService.salvar(this.form.value).subscribe(
        () => {
          alert('Gênero cadastrado!');
          this.form.reset();
          this.router.navigate(['/generos']);
        }
      )
    }
  }
}
