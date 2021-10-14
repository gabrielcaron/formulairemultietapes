define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValidationInput = exports.CHAINE_REMPLACEMENT_NOM_ETIQUETTE = void 0;
    exports.CHAINE_REMPLACEMENT_NOM_ETIQUETTE = '*__nomEtiquette__*';
    var MESSAGES_ERREUR = {
        requis: "Le&nbsp;champ <em>" + exports.CHAINE_REMPLACEMENT_NOM_ETIQUETTE + "</em> est&nbsp;requis.",
        pattern: "Le&nbsp;format du&nbsp;champ <em>" + exports.CHAINE_REMPLACEMENT_NOM_ETIQUETTE + "</em> est&nbsp;invalide.",
    };
    var CLASSE_CHAMP_ERREUR = 'champ--erreur';
    var ValidationInput = (function () {
        function ValidationInput(nomEtiquette, refChamp, messagesErreur) {
            if (refChamp === void 0) { refChamp = new HTMLElement(); }
            if (messagesErreur === void 0) { messagesErreur = MESSAGES_ERREUR; }
            this.messageErreurCourant = '';
            this.estPretAEtreValide = false;
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
        ValidationInput.prototype.valider = function () {
            if (!this.estPretAEtreValide) {
                return true;
            }
            var ancienMessageErreur = this.messageErreurCourant;
            this.messageErreurCourant = '';
            if (this.refInput.getAttribute('required')) {
                if (this.refInput.value == '') {
                    this.messageErreurCourant = this.messagesErreur.requis;
                    console.log('Le champ est vide');
                }
                else if (this.validerAttributPattern() === false &&
                    this.refInput.getAttribute('pattern')) {
                    console.log('Pattern pas valide');
                    this.messageErreurCourant = this.messagesErreur.pattern;
                }
            }
            var inputEstValide = this.messageErreurCourant == '';
            if (this.messageErreurCourant != ancienMessageErreur) {
                if (inputEstValide) {
                    this.retirerMessageErreur();
                }
                else {
                    this.afficherMessageErreur();
                }
            }
            return inputEstValide;
        };
        ValidationInput.prototype.forcerValidation = function () {
            this.estPretAEtreValide = true;
            return this.valider();
        };
        ValidationInput.prototype.reinitialiser = function () {
            this.retirerMessageErreur();
            this.estPretAEtreValide = false;
        };
        ValidationInput.prototype.ajouterEcouteursEvenements = function () {
            this.refInput.addEventListener('change', this.eventVerifierEstPretAEtreValide);
            this.refInput.addEventListener('input', this.eventValider);
        };
        ValidationInput.prototype.retirerEcouteursEvenements = function () {
            this.refInput.removeEventListener('change', this.eventVerifierEstPretAEtreValide);
            this.refInput.removeEventListener('input', this.eventValider);
        };
        ValidationInput.prototype.validerAttributPattern = function () {
            var regexp = new RegExp(this.refInput.pattern);
            return regexp.test(this.refInput.value);
        };
        ValidationInput.prototype.afficherMessageErreur = function () {
            this.refChamp.classList.add(CLASSE_CHAMP_ERREUR);
            this.refInput.setAttribute('aria-invalid', 'true');
            this.refErreur.innerHTML = this.messageErreurCourant.replace(exports.CHAINE_REMPLACEMENT_NOM_ETIQUETTE, this.nomEtiquette);
            console.log(this.nomEtiquette);
            this.refErreur.setAttribute('style', 'display: flex;');
        };
        ValidationInput.prototype.retirerMessageErreur = function () {
            this.refInput.removeAttribute('aria-invalid');
            this.refChamp.classList.remove(CLASSE_CHAMP_ERREUR);
            this.refErreur.setAttribute('style', 'display: none');
            this.messageErreurCourant = '';
            this.refErreur.innerHTML = '';
        };
        ValidationInput.prototype.verifierEstPretAEtreValide = function () {
            if (this.estPretAEtreValide) {
                return;
            }
            this.estPretAEtreValide = true;
            this.valider();
        };
        return ValidationInput;
    }());
    exports.ValidationInput = ValidationInput;
});
//# sourceMappingURL=ValidationInput.js.map