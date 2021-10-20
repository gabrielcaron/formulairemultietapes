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

        /*
         * ÉTAPE 1.2.2
         *
         * 1) Ajouter un écouteur d'événement de type 'submit' sur this.refFormulaire
         *    qui déclenche la fonction this.valider.bind(this)
         *
         * 2) Ajouter un écouteur d'événement de type 'reset' sur this.refFormulaire
         *    qui déclanche la fonction this.reinitialiser.bind(this)
         *
         * 3) Ajouter l'attribut HTML novalidate="true" sur this.refFormulaire
         *    Indice: element.setAttribute()
         */
        this.refFormulaire.addEventListener('submit', this.valider.bind(this));
        this.refFormulaire.addEventListener(
            'reset',
            this.reinitialiser.bind(this)
        );
        this.refFormulaire.setAttribute('noValidate', 'true');
        //--------- ÉTAPE 2.3.1. Analyse du code du constructeur ---------
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

        // Ajout de la référence au bouton submit
        this.refBoutonSubmit = this.refFormulaire.querySelector(
            'button[type="submit"]'
        );

        // Ajout de la référence au bouton reset
        this.refBoutonReset = this.refFormulaire.querySelector(
            'button[type="reset"]'
        );

        this.afficherEtapeCourante(false);

        //--------- FIN ÉTAPE 2.3.1. Analyse du code du constructeur ---------
    }

    /**
     * Retourne tous les champs (contrôles) du formulaire lié à chaque étape
     * @returns {ControlesFormulaire}
     */
    private creerControles(): ControlesFormulaire {
        /**
         * ÉTAPE 3.3.1
         *
         * Ajouter tous les contrôles manquant à l'objet de type ControlesFormulaire
         * retourner de cette méthode
         */
        return {
            [NomEtape.Identification]: [
                // ÉTAPE 3.3.1: Ajouter les validateurs des contrôles présents
                //              dans l'étape 1: Identification
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
                // ÉTAPE 3.3.1: Ajouter les validateurs des contrôles présents
                //              dans l'étape 2: Informations de connexion

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
        /**
         * ÉTAPE 2.3.2.
         *
         * 1) Sélectionner dans le HTML l'étape courante
         *    Pour obtenir l'étape courante, utiliser this.barreProgression.nomEtapeCourante
         *    Pour faire afficher l'étape courante sélectionner le <fieldset> correspondant à l'étape courante
         *    et lui ajouter le style display: flex;
         *    Pour les étapes (<fieldset>) qui ne sont pas à l'état courante, ajouter le style display: none;
         *
         *    Exemple
         *        const refEtapes: HTMLElement[] = Array.apply(null, this.refRacine.querySelectorAll(`[${DATA_ETAPE}]`);
         *        POUR CHAQUE (etape du refEtapes) ALORS // Équivalent à refEtapes.forEach(etape => {})
         *            const nomEtape = etape.getAttribute(DATA_ETAPE);
         *            SI (nomEtape === this.barreProgression.nomEtapeCourante) ALORS
         *                etape.style.display = 'flex';
         *                SI (focusSurEtapeCouranteActif) ALORS
         *                    etape.focus();
         *                FIN DU SI
         *            SINON
         *                etape.style.display = 'none';
         *            FIN DU SI
         *        FIN DU POUR CHAQUE
         *
         *
         * 2) Retier les message d'erreur général à chaque navigation
         *    this.retirerMessageErreurGeneral();
         *
         * 3) Modifier l'affichage des boutons du formulaire
         *    (this.refBoutonSubmit et this.refBoutonReset)
         *
         *    SI (nom de l'étape courante est égale à identification) ALORS
         *        Le texte du bouton submit est "Étape suivante"
         *    SINON SI (nom de l'étape courante est égale à informations de connexion)
         *        Le texte du bouton submit est "S'inscrire"
         *    SINON SI (nom de l'étape courante est égale à confirmation)
         *        Retirer du DOM les boutons submit et resets
         *            // Info: utiliser la méthode element.remove();
         *    FIN DU SI
         *
         */

        // Converti les NodeList en HTMLElement
        const refEtapes: HTMLElement[] = Array.apply(
            null,
            this.refRacine.querySelectorAll(`[${DATA_ETAPE}]`)
        );
        // console.log(refEtapes);

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
        /**
         * ÉTAPE 2.3.3.
         *
         * 1) Modifier l'étape courante de this.barreProgression à l'étape suivante
         *    en utilisant la méthode modifierEtapeCourante()
         *
         *    Exemple
         *
         *        nom de l'étape courante = this.barreProgression.nomEtapeCourante;
         *        SI (nom de l'étape courante est égale identification) ALORS
         *            this.barreProgression.modifierEtapeCourante(NomEtape.InformationsConnexion);
         *        SINON SI (nom de l'étape courante est égale informations de connexion) ALORS
         *            this.barreProgression.modifierEtapeCourante(NomEtape.Confirmation);
         *        FIN DU SI
         *
         *
         * 2) Afficher la nouvelle étape courante dans le formulaire.
         *    this.afficherEtapeCourante();
         *
         */

        // console.log('naviguerEtapeSuivante()');

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
                    // Ajouter le champ en erreur dans le tableau de controleEnErreur
                    this.controlesEnErreur.push(champ);
                    // console.log(
                    //     'Tableau des erreurs: ',
                    //     this.controlesEnErreur
                    // );
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
        /**
         * ÉTAPE 3.2.1 (3.3.2)
         * */

        // console.log(this.controlesEnErreur);

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
        /**
         * ÉTAPE 3.2.2
         */

        this.refMessageErreurGeneral.innerHTML = '';
        this.refMessageErreurGeneral.style.display = 'none';
    }
}
