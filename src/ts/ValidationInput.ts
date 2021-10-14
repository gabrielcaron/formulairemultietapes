export interface MessagesErreur {
    requis?: string;
    pattern?: string;
}

export const CHAINE_REMPLACEMENT_NOM_ETIQUETTE = '*__nomEtiquette__*';

const MESSAGES_ERREUR: MessagesErreur = {
    requis: `Le&nbsp;champ <em>${CHAINE_REMPLACEMENT_NOM_ETIQUETTE}</em> est&nbsp;requis.`,
    pattern: `Le&nbsp;format du&nbsp;champ <em>${CHAINE_REMPLACEMENT_NOM_ETIQUETTE}</em> est&nbsp;invalide.`,
};

const CLASSE_CHAMP_ERREUR = 'champ--erreur';

export class ValidationInput {
    public nomEtiquette: string;
    public refChamp: HTMLElement;
    public refInput: HTMLInputElement;
    public refErreur: HTMLElement;
    public messageErreurCourant: string = '';
    public messagesErreur: MessagesErreur;
    protected estPretAEtreValide: boolean = false;
    protected eventVerifierEstPretAEtreValide: EventListenerOrEventListenerObject;
    protected eventValider: EventListenerOrEventListenerObject;

    constructor(
        nomEtiquette: string,
        refChamp: HTMLElement = new HTMLElement(),
        messagesErreur: MessagesErreur = MESSAGES_ERREUR
    ) {
        this.nomEtiquette = nomEtiquette;
        this.refChamp = refChamp;
        this.refInput = this.refChamp.querySelector('input');
        this.refErreur = this.refChamp.querySelector('.champ__message-erreur');
        this.messagesErreur = messagesErreur;

        /**
         * ÉTAPE 1.3.1
         *
         * Les 7 prochains console.log() sont à supprimer.
         * Ces consoles servent à vous faire comprendre
         * que représente les propriétés de cette classe
         */
        // console.log(`*--- DÉBUT propriétés du ValidationInput ---*`);
        // console.log('this.nomEtiquette = ', this.nomEtiquette);
        // console.log('this.refChamp = ', this.refChamp);
        // console.log('this.refInput = ', this.refInput);
        // console.log('this.refErreur = ', this.refErreur);
        // console.log('this.messagesErreur = ', this.messagesErreur);
        // console.log('*--- FIN propriétés du ValidationInput ---*');

        this.eventVerifierEstPretAEtreValide =
            this.verifierEstPretAEtreValide.bind(this);
        this.eventValider = this.valider.bind(this);

        this.ajouterEcouteursEvenements();
    }

    /**
     * Effectue la validation si le refInput possède
     * un attribut required ou un attribut pattern.
     *
     * @returns {Boolean} Retourne true lorsque le champ est valide
     */
    public valider(): boolean {
        if (!this.estPretAEtreValide) {
            return true;
        }

        const ancienMessageErreur = this.messageErreurCourant;
        this.messageErreurCourant = '';

        /**
         * ÉTAPE 1.3.4
         * Traduire ce pseudocode en JavaScript
         *
         * Voir la documentation de la méthode getAttribute()
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
         *
         *
         *     SI (le refInput possède l'attribut HTML 'required') ALORS
         *         SI (la valeur du refInput est vide) ALORS
         *             la valeur de this.messageErreurCourant est égale au this.messageErreur.requis
         *         SINON SI (this.validerAttributPattern() === false et que refInput possède l'attribut HTML 'pattern') ALORS
         *             la valeur de this.messageErreurCourant est égale au this.messageErreur.pattern
         *         FIN DU SI
         *     FIN DU SI
         *
         *     nouvelle variable inputEstValide = faux;
         *     SI (la valeur de this.messageErreurCourant est égale à '') ALORS
         *         inputEstValide est vrai
         *     SINON
         *         inputEstValide est faux
         *     FIN DU SI
         *
         *     SI (la valeur de this.messageErreurCourant n'est pas égale à la valeur de ancienMessageErreur) ALORS
         *         SI (le inputEstValide) ALORS
         *             appeler this.retirerMessageErreur()
         *         SINON
         *             appeler this.afficherMessageErreur()
         *         FIN DU SI
         *     FIN DU SI
         *
         *     retourner la valeur inputEstValide
         */

        if (this.refInput.getAttribute('required')) {
            if (this.refInput.value == '') {
                this.messageErreurCourant = this.messagesErreur.requis;
                console.log('Le champ est vide');
            } else if (
                this.validerAttributPattern() === false &&
                this.refInput.getAttribute('pattern')
            ) {
                console.log('Pattern pas valide');
                this.messageErreurCourant = this.messagesErreur.pattern;
            }
        }

        const inputEstValide = this.messageErreurCourant == '';

        if (this.messageErreurCourant != ancienMessageErreur) {
            if (inputEstValide) {
                this.retirerMessageErreur();
            } else {
                this.afficherMessageErreur();
            }
        }
        return inputEstValide;
    }

    /**
     * Valider le champ même s'il n'est pas prêt à être validé
     * @returns {Boolean} Retourne true lorsque le champ est valide
     */
    public forcerValidation(): boolean {
        this.estPretAEtreValide = true;
        return this.valider();
    }

    public reinitialiser(): void {
        this.retirerMessageErreur();
        this.estPretAEtreValide = false;
    }

    protected ajouterEcouteursEvenements(): void {
        /*
         * ÉTAPE 1.3.2
         *
         * 1) Ajouter un écouteur d'événement de type 'change' sur this.refInput
         *    qui déclanche la fonction this.eventVerifierEstPretAEtreValide
         *
         *    Regarder le vidéo (en): https://www.youtube.com/watch?v=sxRnmKldiBs
         *
         * 2) Ajouter un écouteur d'événement de type 'input' sur this.refInput
         *    qui déclanche la fonction this.eventValider
         */

        this.refInput.addEventListener(
            'change',
            this.eventVerifierEstPretAEtreValide
        );

        this.refInput.addEventListener('input', this.eventValider);
    }

    protected retirerEcouteursEvenements(): void {
        /*
         * ÉTAPE 1.3.3
         *
         * 1) Retirer l'écouteur d'événement de type 'change' sur this.refInput
         *    qui déclanche la fonction this.eventVerifierEstPretAEtreValide
         *
         * 2) Retirer l'écouteur d'événement de type 'input' sur this.refInput
         *    qui déclanche la fonction this.eventValider
         */
        // console.log(`*--- ValidationInput.retirerEcouteursEvenements() ---*`); // Supprimer cette console.log()

        this.refInput.removeEventListener(
            'change',
            this.eventVerifierEstPretAEtreValide
        );

        this.refInput.removeEventListener('input', this.eventValider);
    }

    /**
     * Effectue une validation RegExp à partir de la valeur de l'attribut HTML 'pattern' du refInput
     * @returns {Boolean} retourne true si la valeur du input respect le pattern
     */
    protected validerAttributPattern(): boolean {
        /**
         * ÉTAPE 1.3.5
         *
         * 1) Tester la valeur 'this.refInput.value' au pattern 'this.refInput.pattern'
         *    Indice: new RegExp(<pattern>).test(<valeur>)
         *
         * 2) Retourner la valeur boolean du regExp.test()
         */

        const regexp = new RegExp(this.refInput.pattern);

        // console.log('Valeur de refInput.value = ', this.refInput.value);
        return regexp.test(this.refInput.value);
    }

    protected afficherMessageErreur(): void {
        /**
         * ÉTAPE 1.3.6
         *
         * 1) Ajouter la classe CLASSE_CHAMP_ERREUR sur this.refChamp
         *    Indice: element.classList.add();
         *
         * 2) Ajouter l'attribut HTML aria-invalid avec la valeur true sur le this.refInput
         *    Doc setAttribute: https://developer.mozilla.org/fr/docs/Web/API/Element/setAttribute
         *    Doc aria-invalid: https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute
         *
         * 3) Ajouter dans le HTML de this.refErreur la valeur du this.messageErreurCourant
         *    Indice 1: element.innerHTML = valeur;
         *    Indice 2: Ne pas oublier de remplacer le texte CHAINE_REMPLACEMENT_NOM_ETIQUETTE par la valeur de this.nomEtiquette
         *          Exemple: this.messageErreurCourant.replace(CHAINE_REMPLACEMENT_NOM_ETIQUETTE, this.nomEtiquette)
         *          Doc: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/replace
         *
         * 4) Ajouter le style 'display: flex;' sur this.refErreur
         */

        this.refChamp.classList.add(CLASSE_CHAMP_ERREUR);
        this.refInput.setAttribute('aria-invalid', 'true');
        this.refErreur.innerHTML = this.messageErreurCourant.replace(
            CHAINE_REMPLACEMENT_NOM_ETIQUETTE,
            this.nomEtiquette
        );
        console.log(this.nomEtiquette);
        this.refErreur.setAttribute('style', 'display: flex;');
    }

    protected retirerMessageErreur(): void {
        /**
         * ÉTAPE 1.3.6
         *
         * 1) Retirer l'attribut HTML aria-invalid sur le this.refInput
         *    Doc removeAttribute: https://developer.mozilla.org/fr/docs/Web/API/Element/removeAttribute
         *
         * 2) Retirer la classe CLASSE_CHAMP_ERREUR sur this.refChamp
         *    Indice: element.classList.remove();
         *
         * 3) Ajouter le style 'display: none;' sur this.refErreur
         *
         * 4) Réinitialiser la valeur de this.messageErreurCourant
         *
         * 5) Retirer le contenu HTML de this.refErreur;
         *    Indice: element.innderHTML = '';
         */

        this.refInput.removeAttribute('aria-invalid');
        this.refChamp.classList.remove(CLASSE_CHAMP_ERREUR);
        this.refErreur.setAttribute('style', 'display: none');
        this.messageErreurCourant = '';
        this.refErreur.innerHTML = '';
    }

    private verifierEstPretAEtreValide(): void {
        if (this.estPretAEtreValide) {
            return;
        }

        this.estPretAEtreValide = true;
        this.valider();
    }
}
