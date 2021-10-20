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

        if (this.refInput.getAttribute('required')) {
            if (this.refInput.value == '') {
                this.messageErreurCourant = this.messagesErreur.requis;
                // console.log('Le champ est vide');
            } else if (
                this.validerAttributPattern() === false &&
                this.refInput.getAttribute('pattern')
            ) {
                // console.log('Pattern pas valide');
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
        this.refInput.addEventListener(
            'change',
            this.eventVerifierEstPretAEtreValide
        );

        this.refInput.addEventListener('input', this.eventValider);
    }

    protected retirerEcouteursEvenements(): void {
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
        const regexp = new RegExp(this.refInput.pattern);

        // console.log('Valeur de refInput.value = ', this.refInput.value);
        return regexp.test(this.refInput.value);
    }

    protected afficherMessageErreur(): void {
        this.refChamp.classList.add(CLASSE_CHAMP_ERREUR);
        this.refInput.setAttribute('aria-invalid', 'true');

        this.refErreur.innerHTML = this.messageErreurCourant.replace(
            CHAINE_REMPLACEMENT_NOM_ETIQUETTE,
            this.nomEtiquette
        );
        this.refErreur.style.display = 'flex';
    }

    protected retirerMessageErreur(): void {
        this.refInput.removeAttribute('aria-invalid');
        this.refChamp.classList.remove(CLASSE_CHAMP_ERREUR);
        this.refErreur.style.display = 'none';
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
