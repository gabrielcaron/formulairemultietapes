import { ValidationInput } from './ValidationInput';

export class ValidationConfirmationCourriel extends ValidationInput {
    private refChampCourriel = null;

    constructor(refFormulaire: HTMLFormElement) {
        super(
            'Confirmation du courriel',
            refFormulaire.querySelector('#champConfirmationCourriel')
        );
        this.refChampCourriel = refFormulaire.querySelector('#champCourriel');
    }

    /**
     * @returns {Boolean} Retourne true lorsque le champ est valide
     */
    public valider(): boolean {
        if (!this.estPretAEtreValide) {
            return true;
        }

        // Valide si le courriel est identique à Confirmation du courriel
        if (super.valider()) {
            if (
                this.refInput.value !=
                    this.refChampCourriel.querySelector('input').value &&
                this.refChampCourriel.querySelector('input').value != ''
            ) {
                this.messageErreurCourant =
                    'Le champ Confirmation du courriel doit être identique au champ Courriel.';
                this.afficherMessageErreur();
            }
        }

        return this.messageErreurCourant === '';
    }
}
