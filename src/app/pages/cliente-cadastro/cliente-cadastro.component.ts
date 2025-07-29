import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ClienteService } from '../../services/cliente.service';
import {Cliente} from "../../models/cliente";
import {LoginService} from "../../services/login.service";
import {AssinaturaService} from "../../services/assinatura.service";

@Component({
  selector: 'app-cliente-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-cadastro.component.html',
  styleUrl: './cliente-cadastro.component.css'
})
export class ClienteCadastroComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clienteService: ClienteService,
    private loginService: LoginService,
    private assinaturaService: AssinaturaService,
    private route: ActivatedRoute) {
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
      const novoCliente: Cliente = this.form.value;

      this.clienteService.salvar(novoCliente).subscribe({
        next: (clienteCadastrado) => {
          alert('Cadastro realizado com sucesso!');

          //  LOGIN AUTOMÁTICO APÓS CADASTRO
          this.loginService.entrar(novoCliente.login, novoCliente.senha).subscribe({
            next: (token) => {
              this.loginService.salvarToken(token.accessToken);




              //  VERIFICA O FLUXO DE ASSINATURA
              const idPlanoSalvo = localStorage.getItem('idPlanoEscolhido');

              if (idPlanoSalvo) {
                const idCliente = this.loginService.extrairDadosToken()?.id;

                const novaAssinatura = {
                  idPlano: +idPlanoSalvo, // Converte a string de volta para número
                  idCliente: idCliente,
                  dataInicio: new Date(),
                  ativa: true
                };

                this.assinaturaService.salvar(novaAssinatura as any).subscribe({
                  next: () => {
                    alert('Cadastro e assinatura realizados com sucesso! Bem-vindo(a)!');
                    localStorage.removeItem('idPlanoEscolhido');
                    // this.router.navigate(['/home']);
                  },
                  error: (errAssinatura) => {
                    console.error('Assinatura automática falhou:', errAssinatura);
                    alert('Seu cadastro foi criado, mas houve um erro ao processar a assinatura.');
                    localStorage.removeItem('idPlanoEscolhido');
                  }
                });

              } else {
                // se NÃO houver plano salvo, segue o fluxo de cadastro sem assinatura de plano
                alert('Cadastro realizado com sucesso!');
                // this.router.navigate(['/home']);
              }





              this.router.navigate(['/home']); // Redireciona para a HOME, com ou sem assinatura
            },
            error: (errLogin) => {
              console.error('Login automático falhou após cadastro.', errLogin);
              this.router.navigate(['/login']);
            }
          });
          // () => {
          //   alert('Cliente cadastrado com sucesso!');
          //   this.form.reset();
          //   this.router.navigate(['/home']);
        },
        error: (errCadastro) => {
          console.error('Erro ao cadastrar cliente', errCadastro);
          alert('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.');
        }
      });
    }
  }
}
