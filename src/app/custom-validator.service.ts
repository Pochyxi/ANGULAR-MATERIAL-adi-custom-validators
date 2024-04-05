import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

interface FormFieldValidators {
  [field: string]: string[];
}

interface FormValidators {
  [formType: string]: FormFieldValidators;
}

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {

  //adi// Oggetto che gestisce i messaggi di errore
  public errorMessages: { [key: string]: { [errorType: string]: string } } = {
    email: {
      'required': 'Email è richiesta.',
      'email': 'Inserisci un indirizzo email valido.',
      'pattern': 'Inserisci un indirizzo email valido.'
    },
    password: {
      'required': 'Password è richiesta.',
      'minlength': 'La password deve essere di almeno 8 caratteri.',
      'maxlength': 'La password deve essere di al massimo 20 caratteri.',
      'pattern': 'La password deve contenere almeno una lettera maiuscola, una lettera minuscola e un numero.'
    }
  };

  constructor(private fb: FormBuilder) { }

  //adi// Validazione custom per l'email
  private emailValidator(): ValidatorFn {
    return Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);
  }

  //adi// Validazione custom per la password
  private passwordValidator(): ValidatorFn {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ]) as ValidatorFn;
  }

  //adi// Metodo per ottenere validatori e base alla parola chiave
  private getValidators(validatorNames: string[]): ValidatorFn[] {
    return validatorNames.map(name => {
      switch (name) {
        case 'email':
          return this.emailValidator();
        case 'password':
          return this.passwordValidator();
          case 'required':
          return Validators.required;
        default:
          return Validators.nullValidator;
      }
    }).filter(v => v !== null) as ValidatorFn[];
  }

  //adi// Tramite questo metodo è possibile comporre intere validazioni per un determinato form
  public getFormValidators(formType: string): { [key: string]: ValidatorFn[] } {
    const formConfig: FormValidators = {
      //adi// Configurazione del login form di esempio in html
      login: {
        email: ['email', 'required'],
        password: ['password']
      },

      //adi// Altro esempio di configurazione per il form di registrazione
      register: {
        email: ['email', 'required'],
        password: ['password'],
        confirmPassword: ['required']
      }
    };

    //adi// Estraggo i validatori per il form specificato in formType
    const formValidators = formConfig[formType] || {};

    //adi// Oggetto che conterrà i validatori per ogni campo del form
    const validators: { [key: string]: ValidatorFn[] } = {};

    //adi// Per ogni campo del form, estraggo i validatori
    Object.keys(formValidators).forEach((field) => {
      validators[field] = this.getValidators(formValidators[field]);
    });

    return validators;
  }

  //adi// Metodo per inizializzare un form
  public initFormAndValidations(formType: string): FormGroup {
    const formValidators = this.getFormValidators(formType);
    const group: { [key: string]: any[] } = {};

    Object.keys(formValidators).forEach(field => {
      group[field] = ['', formValidators[field]];
    });

    return this.fb.group(group);
  }

  //adi// Metodo per ottenere gli errori di un campo del form e mostrare i messaggi di errore in base a come li abbiamo
  //adi// configurati nell'oggetto errorMessages
  getFormErrors(controlName: string, form: FormGroup): string[] {
    const controlErrors: ValidationErrors = form.get(controlName)!.errors ?? {};

    if (!controlErrors) return [];

    return Object.keys(controlErrors).map(key => this.errorMessages[controlName][key]);
  }
}
