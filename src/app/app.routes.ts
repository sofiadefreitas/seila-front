import { Routes } from '@angular/router';
import {ConsultarGeneroComponent} from "./pages/adm/consultar-genero/consultar-genero.component";
import {CadastrarGeneroComponent} from "./pages/adm/cadastrar-genero/cadastrar-genero.component";
import {HomeComponent} from "./pages/home/home.component";
import {PlanoComponent} from "./pages/plano/plano.component";
import {ClienteConsultaComponent} from "./pages/cliente-consulta/cliente-consulta.component";
import {ClienteCadastroComponent} from "./pages/cliente-cadastro/cliente-cadastro.component";
import {LoginComponent} from "./pages/login/login.component";
import {FilmeComponent} from "./pages/filme/filme.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'generos', component: ConsultarGeneroComponent},
  { path: 'generos/:id', component: ConsultarGeneroComponent},
  { path: 'planos', component: PlanoComponent},
  { path: 'planos/:id', component: PlanoComponent},
  { path: 'clientes', component: ClienteConsultaComponent},
  { path: 'clientes/:id', component: ClienteConsultaComponent},
  { path: 'cadastro-cliente', component: ClienteCadastroComponent},
  { path: 'login', component: LoginComponent},
  { path: 'filmes', component: FilmeComponent}
 // { path: 'minha-conta', component: }
];
