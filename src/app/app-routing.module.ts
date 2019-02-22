

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'camara', loadChildren: './camara/camara.module#CamaraPageModule' },
  { path: '', redirectTo: 'formulario', pathMatch: 'full' },
  { path: 'formulario', loadChildren: './formulario/formulario.module#FormularioPageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
