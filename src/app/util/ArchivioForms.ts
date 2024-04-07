// Questo file contiene le configurazioni dei form
export const ArchivioForms = {
  //adi// Configurazione del login form di esempio in html
  login: {
    email: ['email', 'required'],
    password: [
      {name: 'minLength', args: 8},
      {name: 'maxLength', args: 20},
      {
        name: 'pattern',
        args: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
      },
    ]
  },


}
