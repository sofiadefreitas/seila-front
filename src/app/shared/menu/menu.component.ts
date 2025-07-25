import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Subscription} from "rxjs";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {


  menuCliente = [
    { descricao: 'Histórico', rota: 'historico'},
    { descricao: 'Avaliações', rota: 'avaliacoes'},
    { descricao: 'Minha Conta', rota: 'minha-conta'},
  ];

  private subscription!: Subscription;

  menuUsuario: { descricao: string, rota: string}[] = [];
  nomeUsuario!: string;

  constructor(private loginService: LoginService, private router: Router) {
    this.nomeUsuario = '';
    this.menuUsuario = [];
  }

  ngOnInit(): void {
    // Faz a inscrição para observar os eventos do objeto router e atualiza o menu somente após a conclusão da navegação (NavigationEnd)
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarMenu();
      }
    });

    this.atualizarMenu(); // atualiza ao carregar pela primeira vez
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // encerra inscrição
  }

  private atualizarMenu(): void {
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken) {
      this.nomeUsuario = dadosToken.sub;
      // Filtra o menu para montar menuUsuario com os itens permitidos
      this.menuUsuario = this.menuCliente;
    } else {
      this.nomeUsuario = '';
      this.menuUsuario = [];
    }
  }

  sair(): void {
    this.loginService.sair();
    this.atualizarMenu();
    this.router.navigate(['filmes']);
  }
}
