import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormRepositoryComponent} from "./form-repository/form-repository.component";

const routes: Routes = [
  {
    path: '',
    component: FormRepositoryComponent,

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
