import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-cadastro.component.html',
  styleUrl: './cliente-cadastro.component.css'
})
export class ClienteCadastroComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private clienteService: ClienteService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.clienteService.salvar(this.form.value).subscribe(
        () => {
          alert('Cliente cadastrado com sucesso!');
          this.form.reset();
          this.router.navigate(['home']);
        }
      )
    }
  }
}
