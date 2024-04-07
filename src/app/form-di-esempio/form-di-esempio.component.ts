import {Component, OnInit} from '@angular/core';
import {GestoreFormService} from "../gestore-form.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-di-esempio',
  templateUrl: './form-di-esempio.component.html',
  styleUrl: './form-di-esempio.component.scss'
})
export class FormDiEsempioComponent implements OnInit{

  //adi// FormGroup per il login
  login!: FormGroup;

  //adi// Costruttore in cui inizializzo il form per evitare errori
  constructor(private gestoreForm$: GestoreFormService) {
    //adi// Inizializzazione dinamica tramite gestoreForm$
    //adi// Configurazione del form: ArchivioForms.login
    this.login = this.gestoreForm$.inizializzaFormConValidazioni('login');
  }


  ngOnInit() {

  }


}
