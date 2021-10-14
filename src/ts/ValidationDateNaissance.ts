import { ValidationInput } from './ValidationInput';

export class ValidationDateNaissance extends ValidationInput {
    constructor(refFormulaire: HTMLFormElement) {
        super(
            'Date&nbsp;de&nbsp;naissance',
            refFormulaire.querySelector('#champDate')
        );

        /**
         * ÉTAPE 1.4.4
         *
         * Modifier la valeur de l'attribut HTML max sur le this.refInput (#date)
         * pour la date d'aujourd'hui - 18 ans
         *
         * Exemple d'utilisation de l'attribut max:
         * https://www.w3schools.com/tags/att_input_max.asp
         */

        this.refInput.setAttribute(
            'max',
            `${this.obtenirDateNaissanceMinimumPourEtreAdulte()}`
        );
    }

    /**
     * Verifie si la valeur du input correspond à un date de naissance
     * supérieur ou égale à 18 ans
     *
     * @returns {Boolean} Retourne true lorsque le champ est valide
     */
    public valider(): boolean {
        if (!this.estPretAEtreValide) {
            return true;
        }

        // Polymorphisme: appeler la fonction valider de la classe ValidationInput
        super.valider();

        /**
         * ÉTAPE 1.4.5
         *
         * Effectuer ici les validations suplémentaires
         * concerant l'âge minimum de 18 ans
         *
         * Par exemple, si la date saisie ne correspond pas celle d'un adulte,
         * modifier la valeur du this.messageErreurCourant et appeler la méthode this.afficherMessageErreur()
         *
         */

        if (
            this.refInput.value >
            this.obtenirDateNaissanceMinimumPourEtreAdulte()
        ) {
            this.messageErreurCourant = this.messagesErreur.requis;
            this.afficherMessageErreur();
        }

        return this.messageErreurCourant === '';
    }

    /**
     * Retourne la date naissance minimum pour être un adulte
     * @return {String} date du jour - 18 ans au format AAAA-MM_JJ
     */
    private obtenirDateNaissanceMinimumPourEtreAdulte(): string {
        /**
         * ÉTAPE 1.4.2
         *
         * Voir un exemple de cette fonction dans M04NOTES_validation-formulaire/Object Date()
         *
         */

        const dateActuelle = new Date();
        const dateMinimumPourEtreAdulte = new Date(
            dateActuelle.setFullYear(dateActuelle.getFullYear() - 18)
        ).toLocaleString('fr-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        // console.log('date retournée fonction: ', dateMinimumPourEtreAdulte);

        return dateMinimumPourEtreAdulte;
    }

    /**
     * Déterminer si une date de naissance correspond à celle d'un adulte
     * @param {String} dateNaissance au format AAAA-MM-JJ
     * @returns {Boolean} true si la date la de naissance est supérieur à 18 ans
     */
    private estUnAdulte(dateNaissance: string): boolean {
        /**
         * ÉTAPE 1.4.3
         *
         * Voir un exemple de cette fonction dans M04NOTES_validation-formulaire/Object Date()
         *
         */

        const estUnAdulte = (dateNaissance: string): boolean => {
            const dateMinimumPourEtreAdulte = new Date(
                `${this.obtenirDateNaissanceMinimumPourEtreAdulte()} 00:00`
            );
            const dateAniversaire = new Date(`${dateNaissance} 00:00`);
            return (
                dateMinimumPourEtreAdulte.getTime() >= dateAniversaire.getTime()
            );
        };

        return; // retour bidon à supprimer pour empêcher les erreurs
    }
}
