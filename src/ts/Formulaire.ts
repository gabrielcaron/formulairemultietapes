import { ValidationDateNaissance } from './ValidationDateNaissance';
import { ValidationInput } from './ValidationInput';

import {
    BarreProgression,
    NomEtape,
    EVENT_NAVIGUER_ETAPE_SELECTIONNEE,
} from './BarreProgression'; // TP1 - ÉTAPE X
import { ValidationConfirmationCourriel } from './ValidationConfirmationCourriel';

const DATA_ETAPE = 'data-etape';

interface ControlesFormulaire {
    [key: string]: ValidationInput[];
}

export class Formulaire {
    private refRacine: HTMLElement;
    private refFormulaire: HTMLFormElement;
    private refMessageErreurGeneral: HTMLElement;
    private refBoutonSubmit: HTMLButtonElement;
    private refBoutonReset: HTMLButtonElement;
    private controles: ControlesFormulaire;
    private controlesEnErreur: ValidationInput[] = [];
    private barreProgression: BarreProgression; // TP1 - ÉTAPE X

    constructor(
        refRacine: HTMLElement,
        refFormulaire: HTMLFormElement,
        refMessageErreurGeneral: HTMLElement
    ) {
        this.refRacine = refRacine;
        this.refFormulaire = refFormulaire;
        this.refMessageErreurGeneral = refMessageErreurGeneral;

        this.refBoutonSubmit = this.refFormulaire.querySelector(
            'button[type="submit"]'
        );
        this.refBoutonReset = this.refFormulaire.querySelector(
            'button[type="reset"]'
        );

        this.controles = this.creerControles();

        this.refFormulaire.setAttribute('novalidate', 'true');

        // Écouteurs d'événements (1.2.2)

        this.refFormulaire.addEventListener('submit', (evenement) => {
            this.valider.bind(this);
            evenement.preventDefault();
        });

        this.refFormulaire.addEventListener('reset', (evenement) => {
            this.reinitialiser.bind(this);
            evenement.preventDefault();
        });

        this.refFormulaire.addEventListener('submit', this.valider.bind(this));
        this.refFormulaire.addEventListener(
            'reset',
            this.reinitialiser.bind(this)
        );
        this.refFormulaire.setAttribute('noValidate', 'true');
        this.barreProgression = new BarreProgression(NomEtape.Identification);
        this.refRacine.prepend(this.barreProgression.refRacine);

        // Écouteur d'événement ajouté sur l'événement personnalisé (CustomEvent)
        // créer dans la classe BarreProgression.
        // Lorsqu'une étape est sélectionnée dans la barre de progression
        // la méthode afficherEtapeCourante() du Formulaire sera invoquée.
        this.barreProgression.refRacine.addEventListener(
            EVENT_NAVIGUER_ETAPE_SELECTIONNEE,
            () => {
                this.afficherEtapeCourante();
            }
        );

        this.refBoutonSubmit = this.refFormulaire.querySelector(
            'button[type="submit"]'
        );

        this.refBoutonReset = this.refFormulaire.querySelector(
            'button[type="reset"]'
        );

        this.afficherEtapeCourante(false);
    }

    /**
     * Retourne tous les champs (contrôles) du formulaire lié à chaque étape
     * @returns {ControlesFormulaire}
     */
    private creerControles(): ControlesFormulaire {
        return {
            [NomEtape.Identification]: [
                new ValidationInput(
                    'Prénom',
                    this.refRacine.querySelector('#champPrenom')
                ),
                new ValidationInput(
                    'Nom&nbsp;de&nbsp;famille',
                    this.refRacine.querySelector('#champNom')
                ),
                new ValidationInput(
                    'Pseudonyme',
                    this.refRacine.querySelector('#champPseudonyme')
                ),
                new ValidationDateNaissance(this.refFormulaire),
            ],
            [NomEtape.InformationsConnexion]: [
                new ValidationInput(
                    'Numéro de téléphone',
                    this.refRacine.querySelector('#champTelephone')
                ),
                new ValidationInput(
                    'Courriel',
                    this.refRacine.querySelector('#champCourriel')
                ),

                new ValidationConfirmationCourriel(this.refFormulaire),

                new ValidationInput(
                    'Créer un mot de passe',
                    this.refRacine.querySelector('#champMotDePasse')
                ),
            ],
            [NomEtape.Confirmation]: [],
        };
    }

    /**
     * Afficher la section du formulaire (fieldset) correspondant à l'étape courante
     * et gère l'affichage des boutons (submit et reset) à afficher selon l'étape courante
     */
    public afficherEtapeCourante(focusFormulaireActif: boolean = true): void {
        // Converti les NodeList en HTMLElement
        const refEtapes: HTMLElement[] = Array.apply(
            null,
            this.refRacine.querySelectorAll(`[${DATA_ETAPE}]`)
        );

        refEtapes.forEach((etape) => {
            const nomEtape = etape.getAttribute(DATA_ETAPE);
            if (nomEtape === this.barreProgression.nomEtapeCourante) {
                etape.style.display = 'flex';
                if (focusFormulaireActif) {
                    etape.focus();
                }
            } else {
                etape.style.display = 'none';
            }
        });

        this.retirerMessageErreurGeneral();

        const etapeCourante = this.barreProgression.nomEtapeCourante;

        if (etapeCourante == NomEtape.Identification) {
            this.refBoutonSubmit.innerHTML = 'Étape suivante';
        } else if (etapeCourante == NomEtape.InformationsConnexion) {
            this.refBoutonSubmit.innerHTML = "S'inscrire";
        } else if (etapeCourante == NomEtape.Confirmation) {
            this.refBoutonSubmit.remove();
            this.refBoutonReset.remove();
        }
    }

    private naviguerEtapeSuivante(): void {
        const etapeCourante = this.barreProgression.nomEtapeCourante;
        // console.log(etapeCourante);

        if (etapeCourante == NomEtape.Identification) {
            this.barreProgression.modifierEtapeCourante(
                NomEtape.InformationsConnexion
            );
        } else if (etapeCourante == NomEtape.InformationsConnexion) {
            this.barreProgression.modifierEtapeCourante(NomEtape.Confirmation);
        }

        this.afficherEtapeCourante();
    }

    /**
     * Valide tous les contrôles (champs) de l'étape courante
     * et gère l'affichage du message d'erreur général
     *
     * @param event {SubmitEvent}
     */
    private valider(event: SubmitEvent): void {
        // La méthode preventDefault() permet d'arreter la soumission du formulaire
        event.preventDefault();

        // Réinitialiser le tableau qui liste les contrôles erreurs
        this.controlesEnErreur = [];

        // Appeler la méthode forcerValidation() sur tous
        // les contôles de type ValidationInput() de l'étape courante
        this.controles[this.barreProgression.nomEtapeCourante].forEach(
            (champ) => {
                if (!champ.forcerValidation()) {
                    this.controlesEnErreur.push(champ);
                }
            }
        );

        // Si il y a une erreur
        if (this.controlesEnErreur.length > 0) {
            this.afficherMessageErreurGeneral();
        } else {
            this.retirerMessageErreurGeneral();
            this.naviguerEtapeSuivante();
        }
    }

    /**
     * Réinitialise tous les contrôles (champs), supprime les messages d'erreur présents
     * et retourne à la première étape du formulaire (NomEtape.Identification)
     */
    private reinitialiser(): void {
        // Documentation du Object.keys()
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        Object.keys(this.controles).forEach((etape) =>
            this.controles[etape].forEach((champ) => {
                champ.refInput.value = '';
                champ.reinitialiser();
            })
        );

        this.barreProgression.modifierEtapeCourante(NomEtape.Identification);

        this.controlesEnErreur = [];

        this.retirerMessageErreurGeneral();
        this.afficherEtapeCourante();
    }

    /**
     * Génère les élément HTML et la liste des contrôles (champs) en erreur
     * du messages d'erreur générale
     */
    private afficherMessageErreurGeneral(): void {
        this.refMessageErreurGeneral.innerHTML = '';

        this.refMessageErreurGeneral.style.display = 'block';

        let refH2 = document.createElement('h2');

        if (this.controlesEnErreur.length === 1) {
            refH2.innerHTML = 'Une erreur détectée';
            this.refMessageErreurGeneral.append(refH2);
            let refMessage = (document.createElement('p').innerHTML =
                "Veuillez corriger l'erreur sur le contrôle suivant :");
            this.refMessageErreurGeneral.append(refMessage);
        } else {
            refH2.innerHTML =
                `${this.controlesEnErreur.length}` + ' erreurs détectées';
            this.refMessageErreurGeneral.append(refH2);
            let refMessage = (document.createElement('p').innerHTML =
                'Veuillez corriger les erreurs sur les contrôles suivants :');
            this.refMessageErreurGeneral.append(refMessage);
        }
        this.controlesEnErreur.forEach((champ) => {
            let refLi = document.createElement('li');
            let refA = document.createElement('a');
            refA.setAttribute('href', `#${champ.refChamp.getAttribute('id')}`);
            refA.innerHTML = champ.nomEtiquette;
            refLi.append(refA);
            this.refMessageErreurGeneral.append(refLi);
        });

        this.refMessageErreurGeneral.focus();
    }

    /**
     * Retire du HTML le contenu du message d'erreur général
     */
    private retirerMessageErreurGeneral(): void {
        this.refMessageErreurGeneral.innerHTML = '';
        this.refMessageErreurGeneral.style.display = 'none';
    }
}
