export const EVENT_NAVIGUER_ETAPE_SELECTIONNEE = 'naviguerEtapeSelectionnee';

export enum NomEtape {
    Identification = 'identification',
    InformationsConnexion = 'informations-connexion',
    Confirmation = 'confirmation',
}

enum EtatEtape {
    Complet = 'complet',
    Courant = 'courant',
    Desactive = 'desactive',
}

interface EtapesProgression {
    [key: string]: {
        etiquette: string;
        etat: EtatEtape;
    };
}

const CLASS_RACINE = 'barre-progression';
const CLASS_ETAPE = `${CLASS_RACINE}__etape`;
const CLASS_ETAPE_COMPLETEE = `${CLASS_ETAPE}--completee`;
const CLASS_ETAPE_COURANTE = `${CLASS_ETAPE}--courante`;
const CLASS_ETIQUETTE = `${CLASS_RACINE}__etiquette`;
const CLASS_VISUALLY_HIDDEN = 'visually-hidden';
const DATA_NOM_ETAPE = 'data-nom-etape';
const DATA_ETAT_ETAPE = 'data-etat-etape';

export class BarreProgression {
    public nomEtapeCourante: NomEtape;
    public refRacine: HTMLElement;
    private etapesProgression: EtapesProgression = {
        [NomEtape.Identification]: {
            etiquette: 'Identification',
            etat: EtatEtape.Desactive,
        },
        [NomEtape.InformationsConnexion]: {
            etiquette: 'Informations de&nbsp;connexion',
            etat: EtatEtape.Desactive,
        },
        [NomEtape.Confirmation]: {
            etiquette: 'Confirmation',
            etat: EtatEtape.Desactive,
        },
    };
    private eventNaviguerEtapeSelectionnee: EventListenerOrEventListenerObject;
    private eventNaviguerClavierEtapeSelectionnee: EventListenerOrEventListenerObject;

    constructor(nomEtapeCourante: NomEtape = NomEtape.Identification) {
        this.eventNaviguerEtapeSelectionnee =
            this.naviguerEtapeSelectionnee.bind(this);

        this.eventNaviguerClavierEtapeSelectionnee =
            this.naviguerClavierEtapeSelectionnee.bind(this);

        this.refRacine = this.creerRacineElement();
        this.modifierEtapeCourante(nomEtapeCourante);
    }

    public modifierEtapeCourante(nomEtapeCourante: NomEtape): void {
        this.nomEtapeCourante = nomEtapeCourante;
        this.definirEtatEtapes();
        this.redessinerHTMLElement();
    }

    /**
     * Retoune une <nav> composé d'une liste numéroté HTML (<ol>) correspondant
     * au template HTML complet de la barre de progression
     *
     * @returns {HTMLElement}
     */
    private creerRacineElement(): HTMLElement {
        /**
         * ÉTAPE 2.2.3.
         *
         * 1) Créer la balise racine <nav>
         *    La balise racine de la barre de progression est une <nav>.
         *    Créer cette balise avec document.createElement('nav');
         *    Cette <nav> à un attribut HTML 'aria-label' qui a comme valeur 'Étapes de progression du formulaire'
         *         Info: L'attribut 'aria-label' est ajouté pour que le lecteur d'écran inquique à l'utilisateur le nom de cette navigation
         *    NOTE: La <nav> est composé d'un <ol> qui contiendra plusieurs <li> qui correspondent à toutes les étapes listées dans l'objet this.etapesProgression
         *
         * 2) Créer la balise <ol>
         *    Créer cette balise avec document.createElement('ol');
         *    Ajouter la classe CLASS_RACINE sur ce <ol>
         *    Ajouter ce <ol> dans la balise <nav>
         *        Indice: <nav>.append(<ol>)
         *                Doc: https://developer.mozilla.org/en-US/docs/Web/API/Element/append
         *    NOTE: Le <ol> est composé de plusieurs <li> qui correspondent à toutes les étapes listées dans l'objet this.etapesProgression
         *
         * 3) Créer les balises <li>
         *    Vous devrez faire une boucle sur les clés de l'objet this.etapesProgression pour générer chaque <li>
         *    Ajouter sur chaque <li> la classe CLASS_ETAPE
         *    Pour chaque <li> ajouter les attributs suivants:
         *      *  L'attribut 'data-nom-etape' avec la valeur le nom de l'étape
         *         Info: utiliser la const DATA_NOM_ETAPE
         *      *  L'attribut 'data-etat-etape' avec la valeur l'état de l'étape
         *         Info: utiliser la const DATA_ETAT_ETAPE
         *    Ajouter chaque <li> dans le <ol> avec la méthode append()
         *    Injecter dans chaque <li> un <span> créer avec la méthode document.createElement('span')
         *        Ajouter sur chaque <span> la classe CLASS_ETIQUETTE
         *        Ajouter dans le innerHTML du <span> la valeur de l'étiquette de l'étape
         *            Exemple: <span>.innerHTML = this.etapesProgression[<nomEtape>].etiquette
         */

        const refNav: HTMLElement = document.createElement('nav');
        refNav.setAttribute(
            'aria-label',
            'Étapes de progression du formulaire'
        );

        const refOl: HTMLOListElement = document.createElement('ol');
        refOl.classList.add(CLASS_RACINE);
        refNav.append(refOl);

        Object.keys(this.etapesProgression).forEach((etape) => {
            // console.log(etape);
            const refLi = document.createElement('li');
            refLi.classList.add(CLASS_ETAPE);
            refLi.setAttribute(DATA_NOM_ETAPE, etape);
            refLi.setAttribute(
                DATA_ETAT_ETAPE,
                this.etapesProgression[etape].etat
            );

            const refSpan = document.createElement('span');
            refSpan.classList.add(CLASS_ETIQUETTE);
            refSpan.innerHTML = this.etapesProgression[etape].etiquette;
            refLi.append(refSpan);
            refOl.append(refLi);
        });

        // document.querySelector('main').prepend(refNav);

        // console.log(refNav);

        return refNav;
    }

    /**
     * Détermine l'état de chaque étape selon le nom de l'étape courante
     */
    private definirEtatEtapes(): void {
        switch (this.nomEtapeCourante) {
            case NomEtape.Identification:
                this.etapesProgression.identification.etat = EtatEtape.Courant;
                this.etapesProgression[NomEtape.InformationsConnexion].etat =
                    EtatEtape.Desactive;
                this.etapesProgression.confirmation.etat = EtatEtape.Desactive;
                break;
            case NomEtape.InformationsConnexion:
                this.etapesProgression.identification.etat = EtatEtape.Complet;
                this.etapesProgression[NomEtape.InformationsConnexion].etat =
                    EtatEtape.Courant;
                this.etapesProgression.confirmation.etat = EtatEtape.Desactive;
                break;
            case NomEtape.Confirmation:
                this.etapesProgression.identification.etat =
                    EtatEtape.Desactive;
                this.etapesProgression[NomEtape.InformationsConnexion].etat =
                    EtatEtape.Desactive;
                this.etapesProgression.confirmation.etat = EtatEtape.Courant;
                break;
        }
    }

    /**
     * Redénifi tous les classes et attributs appliqués sur toutes les étapes (<li>)
     */
    private redessinerHTMLElement(): void {
        const refEtapes: HTMLLIElement[] = Array.apply(
            null,
            this.refRacine.querySelectorAll(`.${CLASS_ETAPE}`)
        );

        refEtapes.forEach((etape) => {
            const attributNomEtape = etape.getAttribute(
                DATA_NOM_ETAPE
            ) as NomEtape;
            const attributEtatEtape = etape.getAttribute(
                DATA_ETAT_ETAPE
            ) as EtatEtape;
            const nouvelEtatEtape =
                this.etapesProgression[attributNomEtape].etat;

            if (nouvelEtatEtape === attributEtatEtape) {
                return;
            }

            const refEtiquette: HTMLSpanElement = etape.querySelector(
                `.${CLASS_ETIQUETTE}`
            );

            this.reinitialiserClassesEtAttributsEtape(etape, refEtiquette);
            this.definirClassesEtAttributsEtape(
                nouvelEtatEtape,
                etape,
                refEtiquette
            );
        });
    }

    private ajouterEcouteursEvenementsEtape(
        refEtiquette: HTMLSpanElement
    ): void {
        /*
         * ÉTAPE 2.2.6.
         *
         * 1) Ajouter un écouteur d'événement de type 'click' sur refEtiquette
         *    qui déclanche la fonction this.eventNaviguerEtapeSelectionnee
         *
         * 2) Ajouter un écouteur d'événement de type 'keydown' sur refEtiquette
         *    qui déclanche la fonction this.eventNaviguerClavierEtapeSelectionnee
         */

        refEtiquette.addEventListener(
            'click',
            this.eventNaviguerEtapeSelectionnee
        );
        refEtiquette.addEventListener(
            'keydown',
            this.eventNaviguerClavierEtapeSelectionnee
        );
    }

    private retirerEcouteursEvenementsEtape(
        refEtiquette: HTMLSpanElement
    ): void {
        /*
         * ÉTAPE 2.2.7.
         *
         * 1) Retirer l'écouteur d'événement de type 'keydown' sur refEtiquette
         *    qui déclanche la fonction this.eventNaviguerEtapeSelectionnee
         *
         * 2) Retirer l'écouteur d'événement de type 'input' sur refEtiquette
         *    qui déclanche la fonction this.eventNaviguerClavierEtapeSelectionnee
         */

        refEtiquette.removeEventListener(
            'click',
            this.eventNaviguerEtapeSelectionnee
        );
        refEtiquette.removeEventListener(
            'keydown',
            this.eventNaviguerClavierEtapeSelectionnee
        );
    }

    private naviguerEtapeSelectionnee(event: Event): void {
        const refEtiquette = event.currentTarget as HTMLSpanElement;
        const refEtape = refEtiquette.closest(`.${CLASS_ETAPE}`);

        this.modifierEtapeCourante(
            refEtape.getAttribute(DATA_NOM_ETAPE) as NomEtape
        );

        /**
         * Attacher et envoyer un événement personnalisé sur l'élément refRacine avec dispatchEvent()
         * Doc: https://developer.mozilla.org/fr/docs/Web/API/EventTarget/dispatchEvent
         *
         * Cet événement pourra être écouté dans la classe Formulaire.
         * Lorsque la classe Formulaire recevra l'événement EVENT_NAVIGUER_ETAPE_SELECTIONNEE
         * provenant de l'objet BarreProgression, la méthode Formulaire.afficherEtapeCourante()
         * pourra être déclenchée pour modifier la section du formulaire à afficher.
         */
        this.refRacine.dispatchEvent(
            /**
             * Création d'un événement JavaScript personnalité avec CustomEvent()
             * Doc: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
             */
            new CustomEvent(EVENT_NAVIGUER_ETAPE_SELECTIONNEE, {
                bubbles: true,
            })
        );
    }

    private naviguerClavierEtapeSelectionnee(event: KeyboardEvent): void {
        /**
         * ÉTAPE 2.2.8.
         *
         *     SI (la touche 'Enter' est enfobcé) ALORS
         *         Naviguer à l'étape sélectionnée
         *             // Indice: naviguerEtapeSelectionnee(event)
         *         Arrêtrer l'éxécution de l'event
         *             // Indice: preventDefault()
         *             // Doc: https://developer.mozilla.org/fr/docs/Web/API/Event/preventDefault
         *     FIN DU SI
         */

        if (event.key == 'Enter') {
            this.naviguerEtapeSelectionnee(event);
            event.preventDefault();
        }
    }

    private definirClassesEtAttributsEtape(
        etatEtape: EtatEtape,
        refEtape: HTMLLIElement,
        refEtiquette: HTMLSpanElement
    ): void {
        /**
         * ÉTAPE 2.2.4.
         *
         * 1) Ajouter l'attribut DATA_ETAT_ETAPE avec la valeur etatEtape sur l'élément refEtape
         *    Indice: element.setAttribute(DATA_ETAT_ETAPE, etatEtape)
         *
         * 2) Gestion de l'affichage d'une étape à l'état complété
         *
         *    SI (l'état de l'étape est complété) ALORS
         *        créer un élément <span> avec la classe .visually-hidden
         *            // Indice: createElement();
         *        Insérer le texte 'Étape complétée: ' dans le nouveau span
         *            // Indice: innerHTML = 'Étape complétée: '
         *        Ajouter la classe CLASS_ETAPE_COMPLETEE sur l'élément refEtape
         *        Ajouter l'attribut HTML 'tabindex' avec la valeur '0' sur l'élément refEtiquette
         *            // Info: Le tabindex="0" permet de rendre focusable un élément HTML
         *        Ajouter l'attribut HTML 'role' avec la valeur 'button' sur l'élément refEtiquette
         *            // Info: Le role button indique au lecteur d'écran que l'élément refEtiquette se comportera comme un bouton
         *            //       Le lecteur d'écran s'attend donc que le refEtiquette déclenche une action sur le l'événement 'click' et 'keydown enter'
         *            // Exemple: https://www.w3.org/TR/wai-aria-practices-1.1/examples/button/button.html
         *        Appeler la méthode this.ajouterEcouteursEvenementsEtape(refEtiquette)
         *            // Cette méthode ajoutera les écouteurs d'événement 'click' et 'keydown' sur le refEtiquette
         *    FIN DU SI
         *
         *
         * 3) Gestion de l'affichage d'une étape à l'état courant
         *
         *    SI (l'état de l'étape est courante) ALORS
         *        Ajouter la classe CLASS_ETAPE_COURANTE sur l'élément refEtape
         *        Ajouter l'attribut HTML 'aria-current' avec la valeur 'step' sur l'élément refEtape
         *            // Info: Indique au lecteur d'écran que l'étape est la courante
         *    FIN DU SI
         */

        refEtape.setAttribute(DATA_ETAT_ETAPE, etatEtape);

        if (etatEtape === EtatEtape.Complet) {
            const refSpan = document.createElement('span');
            refSpan.classList.add('visually-hidden');
            refSpan.innerHTML = 'Étape complétée: ';
            refEtape.prepend(refSpan);
            refEtape.classList.add(CLASS_ETAPE_COMPLETEE);
            refEtiquette.setAttribute('tabindex', '0');
            refEtiquette.setAttribute('role', 'button');
            this.ajouterEcouteursEvenementsEtape(refEtiquette);
        } else if (etatEtape == EtatEtape.Courant) {
            refEtape.classList.add(CLASS_ETAPE_COURANTE);
            refEtape.setAttribute('aria-current', 'step');
        }
    }

    /**
     * Retire tous les classes CSS et les attributs HTML qui ont été ajouter sur les étapes
     *
     * @param refEtape {HTMLLIElement}
     * @param refEtiquette {HTMLSpanElement}
     */
    private reinitialiserClassesEtAttributsEtape(
        refEtape: HTMLLIElement,
        refEtiquette: HTMLSpanElement
    ): void {
        /**
         * ÉTAPE 2.2.5.
         *
         * 1) Retirer la classe CLASS_ETAPE_COMPLETEE sur l'élément refEtape
         *
         * 2) Retirer la classe CLASS_ETAPE_COURANTE sur l'élément refEtape
         *
         * 3) Retirer du HTML le <span> de l'étape complétée avec la classe .visually-hidden
         *    Indice 1: refEtape.querySelector(`.${CLASS_VISUALLY_HIDDEN}`)
         *    Indice 2: element.remove();
         *              Doc: https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
         *
         * 4) Retirer l'attribut HTML 'tabindex' sur l'élément refEtiquette
         *
         * 5) Retirer l'attribut HTML 'role' sur l'élément refEtiquette
         *
         * 6) Retirer l'attribut HTML 'aria-current' sur l'élément refEtape
         *
         * 7) Retirer les écouteurs d'événements appriqués sur l'élément refEtiquette
         *    Indice: this.retirerEcouteursEvenementsEtape(refEtiquette);
         */

        refEtape.classList.remove(CLASS_ETAPE_COMPLETEE);
        refEtape.classList.remove(CLASS_ETAPE_COURANTE);
        const refVisuallyHidden = refEtape.querySelector(
            `${CLASS_VISUALLY_HIDDEN}`
        );
        if (refVisuallyHidden) {
            refVisuallyHidden.remove();
        }
        refEtiquette.removeAttribute('tabindex');
        refEtiquette.removeAttribute('role');
        refEtape.removeAttribute('aria-current');
        this.retirerEcouteursEvenementsEtape(refEtiquette);
    }
}
