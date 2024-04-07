import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormDiEsempioComponent} from "./form-di-esempio/form-di-esempio.component";

const routes: Routes = [
  {
    path: '',
    component: FormDiEsempioComponent,

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
