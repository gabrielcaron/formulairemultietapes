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
