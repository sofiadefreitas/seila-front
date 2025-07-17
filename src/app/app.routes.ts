import { Routes } from '@angular/router';
import {ConsultarGeneroComponent} from "./pages/adm/consultar-genero/consultar-genero.component";
import {CadastrarGeneroComponent} from "./pages/adm/cadastrar-genero/cadastrar-genero.component";
import {HomeComponent} from "./pages/home/home.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generos', component: ConsultarGeneroComponent},
  { path: 'generos/:id', component: ConsultarGeneroComponent},
  { path: 'adm/generos', component: CadastrarGeneroComponent}
];
