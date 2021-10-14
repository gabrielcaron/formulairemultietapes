import { Formulaire } from './Formulaire';

const moduleFormulaire = new Formulaire(
    document.querySelector('main'),
    document.getElementById('form') as HTMLFormElement,
    document.getElementById('messageErreurGeneral')
);
