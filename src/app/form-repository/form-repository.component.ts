import {Component, OnInit} from '@angular/core';
import {CustomValidatorService} from "../custom-validator.service";
import {FormBuilder, FormGroup, ValidationErrors} from "@angular/forms";

@Component({
  selector: 'app-form-repository',
  templateUrl: './form-repository.component.html',
  styleUrl: './form-repository.component.scss'
})
export class FormRepositoryComponent implements OnInit{

  //adi// FormGroup per il login
  login!: FormGroup;
  errorMessages = this.val$.errorMessages;

  //adi// Costruttore in cui inizializzo il form per evitare errori
  constructor(private val$: CustomValidatorService, private fb: FormBuilder) {
    this.login = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  //adi// Dato che abbiamo definito tale configurazione possiamo inizializzare il form nel metodo ngOnInit
  ngOnInit() {
    this.login = this.val$.initFormAndValidations('login')
  }

  //adi// Metodo per ottenere gli errori di un campo del form
  //adi// Il vero metodo per ottenere gli errori è getFormErrors, che si trova nel servizio CustomValidatorService
  //adi// ritorna una lista di stringhe
  getFormErrors(controlName: string, login: FormGroup) {
    return this.val$.getFormErrors(controlName, login);
  }
}
