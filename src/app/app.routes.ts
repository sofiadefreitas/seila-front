import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {PlanoComponent} from "./pages/plano/plano.component";
import {ClienteConsultaComponent} from "./pages/cliente-consulta/cliente-consulta.component";
import {ClienteCadastroComponent} from "./pages/cliente-cadastro/cliente-cadastro.component";
import {LoginComponent} from "./pages/login/login.component";
import {FilmeComponent} from "./pages/filme/filme.component";
import {MinhaContaComponent} from "./pages/minha-conta/minha-conta.component";
import {AvaliacaoComponent} from "./pages/avaliacao/avaliacao.component";
import {HistoricoComponent} from "./pages/historico/historico.component";
import {AssinaturaComponent} from "./pages/assinatura/assinatura.component";
import {AvaliacaoCadastroComponent} from "./pages/avaliacao-cadastro/avaliacao-cadastro.component";
import {PerfilComponent} from "./pages/perfil/perfil.component";
import {AssinaturaGerenciarComponent} from "./pages/assinatura-gerenciar/assinatura-gerenciar.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: 'planos', component: PlanoComponent},

  { path: 'clientes', component: ClienteConsultaComponent},

  { path: 'cadastro', component: ClienteCadastroComponent},

  { path: 'login', component: LoginComponent},

  { path: 'filmes', component: FilmeComponent},

  { path: 'filmes/:id', component: FilmeComponent},

  { path: 'minha-conta', component: MinhaContaComponent},

  { path: 'historico', component: HistoricoComponent },

  { path: 'avaliacoes', component: AvaliacaoComponent},

  { path: 'avaliar/:idFilme', component: AvaliacaoCadastroComponent},

  { path: 'minha-conta/assinaturas', component: AssinaturaComponent},

  { path: 'assinatura-gerenciar', component: AssinaturaGerenciarComponent},

  { path: 'perfil', component: PerfilComponent}

];
