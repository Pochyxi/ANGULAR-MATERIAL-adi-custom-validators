
//adi// Questa classe contiene i messaggi di errore per i form, quindi è possibile per ogni form avere i propri messaggi di errore
//adi// Questo è utile per la localizzazione e la personalizzazione dei messaggi di errore
//adi// In questo caso, i messaggi di errore sono per il form di login
//adi// In caso non venga specificato un form, verranno utilizzati i messaggi di errore di default
export class MessaggiErroreForms {
  private static readonly messaggiDiErroreLogin: { [key: string]: (params: any) => string } = {
    'required': () => 'Questo campo è obbligatorio.',
    'minlength': (params) => `*La lunghezza minima richiesta è di ${params['requiredLength']} caratteri.`,
    'maxlength': (params) => `*La lunghezza massima consentita è di ${params['requiredLength']} caratteri.`,
    'pattern': () => `*Il formato non è valido. Una lettera maiuscola, una lettera minuscola e un numero.`,
    'min': (params) => `*Il valore minimo consentito è ${params['min']}.`,
    'max': (params) => `*Il valore massimo consentito è ${params['max']}.`,
    'email': () => '*L\'indirizzo email non è valido.',
  };

  public static getMessaggiDiErroreLogin(nomeForm: string): { [key: string]: (params: any) => string } {
    switch (nomeForm) {
      case 'login': {
        return this.messaggiDiErroreLogin;
      }
      default: {
        return {
          'required': () => 'Questo campo è obbligatorio.',
          'minlength': (params) => `*La lunghezza minima richiesta è di ${params['requiredLength']} caratteri.`,
          'maxlength': (params) => `*La lunghezza massima consentita è di ${params['requiredLength']} caratteri.`,
          'pattern': () => `*Il formato non è valido.`,
          'min': (params) => `*Il valore minimo consentito è ${params['min']}.`,
          'max': (params) => `*Il valore massimo consentito è ${params['max']}.`,
          'email': () => '*L\'indirizzo email non è valido.',
        };
      }
    }
  }
}
