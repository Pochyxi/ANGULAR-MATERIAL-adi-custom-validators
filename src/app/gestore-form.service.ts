import {Injectable, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {BehaviorSubject, Subscription} from "rxjs";
import {ArchivioForms} from "./util/ArchivioForms";

interface ValidatoriCampiForm {
  [field: string]: (string | { name: string; args: any })[];
}


interface ValidatoriForm {
  [formType: string]: ValidatoriCampiForm;
}

@Injectable({
  providedIn: 'root'
})
export class GestoreFormService implements OnDestroy{

  oggettoDiValidazioneSubject = new BehaviorSubject<{[key: string]: string[]}>({});
  oggettoDiValidazione$ = this.oggettoDiValidazioneSubject.asObservable();

  private sottoscrizioneErrori!: Subscription;

  nomeFormSubject = new BehaviorSubject<string>('');
  nomeForm$ = this.nomeFormSubject.asObservable();

  constructor(private costruttoreForm: FormBuilder) { }



  //adi// Validazione custom per l'email
  private validatoreEmail(): ValidatorFn {
    return Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
    ]) as ValidatorFn;
  }

  //adi// Validazione custom per la password
  private validatorePassword(): ValidatorFn {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ]) as ValidatorFn;
  }

  //adi// Metodo per ottenere validatori e base alla parola chiave
  private riceviValidatori(nomiValidatori: (string | { name: string; args: any })[]): ValidatorFn[] {
    return nomiValidatori.map(validatore => {
      if (typeof validatore === 'string') {
        switch (validatore) {
          case 'password':
            return this.validatorePassword();

          case 'email-custom':
            return this.validatoreEmail();

          //adi// Verifica che il campo non sia vuoto
          case 'required':
            return Validators.required;
          //adi// Controlla che il valore del campo corrisponda a un'email valida
          case 'email':
            return Validators.email;
          //adi// Verifica che il valore del campo sia numerico e non superi il valore massimo specificato
          case 'max':
            throw new Error('Validator "max" requires an argument');
          //adi// Verifica che il valore del campo sia numerico e sia almeno il minimo specificato
          case 'min':
            throw new Error('Validator "min" requires an argument');
          default:
            return Validators.nullValidator;
        }
      } else {
        switch (validatore.name) {
          //adi// Impone una lunghezza minima al valore del campo
          case 'minLength':
            return Validators.minLength(validatore.args);
          //adi// Impone una lunghezza massima al valore del campo
          case 'maxLength':
            return Validators.maxLength(validatore.args);
          //adi// Controlla che il valore del campo corrisponda al pattern specificato
          case 'pattern':
            return Validators.pattern(validatore.args);
          //adi// Verifica che il valore del campo sia numerico e non superi il valore massimo specificato
          case 'max':
            return Validators.max(validatore.args);
          //adi// Verifica che il valore del campo sia numerico e sia almeno il minimo specificato
          case 'min':
            return Validators.min(validatore.args);
          default:
            return Validators.nullValidator;
        }
      }
    }).filter(v => v !== Validators.nullValidator) as ValidatorFn[];
  }

  //adi// Tramite questo metodo è possibile comporre intere validazioni per un determinato form
  public riceviValidatoriDelForm(nomeDelForm: string): { [key: string]: ValidatorFn[] } {
    const configuratoreForm: ValidatoriForm = ArchivioForms;

    //adi// Estraggo i validatori per il form specificato in formType
    const validatoriForm = configuratoreForm[nomeDelForm] || {};

    //adi// Oggetto che conterrà i validatori per ogni campo del form
    const validatori: { [key: string]: ValidatorFn[] } = {};

    //adi// Per ogni campo del form, estraggo i validatori
    Object.keys(validatoriForm).forEach((field) => {
      validatori[field] = this.riceviValidatori(validatoriForm[field]);
    });

    return validatori;
  }

  //adi// Metodo per inizializzare un form
  public inizializzaFormConValidazioni(nomeForm: string): FormGroup {
    const validatoriForm = this.riceviValidatoriDelForm(nomeForm);
    const gruppo: { [key: string]: any } = {};

    Object.keys(validatoriForm).forEach(campo => {
      gruppo[campo] = ['', Validators.compose(validatoriForm[campo])];
    });

    const form = this.costruttoreForm.group(gruppo);
    this.nomeFormSubject.next(nomeForm);

    //adi// Sottoscrizione agli stati di validità
    this.sottoscrizioneErrori = form.valueChanges.subscribe(() => {
      const errori: {[key: string]: string[]} = {};

      Object.keys(form.controls).forEach(nomeControllo => {
        const controlo = form.get(nomeControllo);

        if (controlo && controlo.errors && (controlo.dirty || controlo.touched) ) {

          errori[nomeControllo] = Object.keys(controlo.errors).map(chiaviErrore => {

            return chiaviErrore;
          });
        }
      });

      //adi// Se nessun controllo ha errori (o se sono tutti puliti o non toccati), `errors` sarà un oggetto vuoto
      this.oggettoDiValidazioneSubject.next(errori);
    });

    return form;
  }

  dissiscriviDalForm() {
    if (this.sottoscrizioneErrori) {
      this.sottoscrizioneErrori.unsubscribe();
    }
    this.oggettoDiValidazioneSubject.next({});
  }

  ngOnDestroy() {
    this.dissiscriviDalForm();
  }
}
