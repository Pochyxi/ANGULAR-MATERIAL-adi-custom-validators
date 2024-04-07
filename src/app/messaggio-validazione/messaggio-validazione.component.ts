import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, AbstractControlDirective, FormGroup} from "@angular/forms";
import {GestoreFormService} from "../gestore-form.service";
import {Subscription} from "rxjs";
import {MessaggiErroreForms} from "../util/MessaggiErroreForms";

@Component({
  selector: 'app-messaggio-validazione',
  templateUrl: './messaggio-validazione.component.html',
  styleUrl: './messaggio-validazione.component.scss'
})
export class MessaggioValidazioneComponent implements OnInit {

  nomeForm = '';

  //adi// Input per il controllo del form
  @Input() controllo: AbstractControlDirective | AbstractControl | null = null;

  //adi// nome del controllo (campo input) del form
  @Input() nomeControllo: string = '';

  //adi// oggetto di validazione per il controllo del form(contiene i messaggi di errore)

  //adi// sottoscrizione per gli errori del form
  sottoscrizioneErroriForm!: Subscription;
  //adi// array per contenere gli errori correnti
  erroriCorrenti: string[] = [];

  //adi// oggetto per i messaggi di errore che verranno visualizzati
  //adi// tale messaggi sono configurati in MessaggiErroreForms
  private static messaggiDiErrore: { [key: string]: (params: any) => string } = {};

  constructor(private gestoreForm$: GestoreFormService) {
  }

  ngOnInit() {
    //adi// sottoscrizione per gli errori del form
    this.sottoscrizioneErroriForm = this.gestoreForm$.oggettoDiValidazione$.subscribe(errori => {
      if (errori[this.nomeControllo]) {
        // Aggiorna currentErrors solo se ci sono errori specifici per questo controllo
        this.erroriCorrenti = errori[this.nomeControllo];
      } else {
        this.erroriCorrenti = [];
      }
    });

    //adi// sottoscrizione al nome del form e settaggio dei messaggi per tale form
    this.gestoreForm$.nomeForm$.subscribe({
      next: value => {
        this.nomeForm = value;
        MessaggioValidazioneComponent.messaggiDiErrore = MessaggiErroreForms.getMessaggiDiErrore(value)
      }
    })
  }

  ngOnDestroy() {
    //adi// dissiscrivi dal form e resetta gli errori
    this.sottoscrizioneErroriForm.unsubscribe();
    this.gestoreForm$.oggettoDiValidazioneSubject.next({});
  }

  dovreiMostrare(): boolean {
    // Mostra gli errori se erroriCorrenti contiene elementi
    return this.erroriCorrenti.length > 0;
  }


  listaDiErrori(): string[] {
    if (!this.controllo || !this.controllo.errors) {
      return [];
    }

    // Ora passiamo l'intero oggetto errore come params a getMessage
    return Object.keys(this.controllo.errors).map(codiceErrore => {

      const parametriErrore = this.controllo?.errors?.[codiceErrore];

      return this.estraiMessaggi(codiceErrore, parametriErrore);
    });
  }

  private estraiMessaggi(nome: string, params: any): string {

    //adi// nel caso di required il params è un booleano
    if (params !== true) {
      params['nomeControllo'] = this.nomeControllo;
    }

    const generatoreMessaggi = MessaggioValidazioneComponent.messaggiDiErrore[nome];
    // Passa i params direttamente al generatore Messaggi
    return generatoreMessaggi ? generatoreMessaggi(params) : 'Errore sconosciuto';
  }

}
