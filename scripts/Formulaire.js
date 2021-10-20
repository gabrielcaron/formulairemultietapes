define(["require", "exports", "./ValidationDateNaissance", "./ValidationInput", "./BarreProgression", "./ValidationConfirmationCourriel"], function (require, exports, ValidationDateNaissance_1, ValidationInput_1, BarreProgression_1, ValidationConfirmationCourriel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Formulaire = void 0;
    var DATA_ETAPE = 'data-etape';
    var Formulaire = (function () {
        function Formulaire(refRacine, refFormulaire, refMessageErreurGeneral) {
            var _this = this;
            this.controlesEnErreur = [];
            this.refRacine = refRacine;
            this.refFormulaire = refFormulaire;
            this.refMessageErreurGeneral = refMessageErreurGeneral;
            this.refBoutonSubmit = this.refFormulaire.querySelector('button[type="submit"]');
            this.refBoutonReset = this.refFormulaire.querySelector('button[type="reset"]');
            this.controles = this.creerControles();
            this.refFormulaire.setAttribute('novalidate', 'true');
            this.refFormulaire.addEventListener('submit', function (evenement) {
                _this.valider.bind(_this);
                evenement.preventDefault();
            });
            this.refFormulaire.addEventListener('reset', function (evenement) {
                _this.reinitialiser.bind(_this);
                evenement.preventDefault();
            });
            this.refFormulaire.addEventListener('submit', this.valider.bind(this));
            this.refFormulaire.addEventListener('reset', this.reinitialiser.bind(this));
            this.refFormulaire.setAttribute('noValidate', 'true');
            this.barreProgression = new BarreProgression_1.BarreProgression(BarreProgression_1.NomEtape.Identification);
            this.refRacine.prepend(this.barreProgression.refRacine);
            this.barreProgression.refRacine.addEventListener(BarreProgression_1.EVENT_NAVIGUER_ETAPE_SELECTIONNEE, function () {
                _this.afficherEtapeCourante();
            });
            this.refBoutonSubmit = this.refFormulaire.querySelector('button[type="submit"]');
            this.refBoutonReset = this.refFormulaire.querySelector('button[type="reset"]');
            this.afficherEtapeCourante(false);
        }
        Formulaire.prototype.creerControles = function () {
            var _a;
            return _a = {},
                _a[BarreProgression_1.NomEtape.Identification] = [
                    new ValidationInput_1.ValidationInput('Prénom', this.refRacine.querySelector('#champPrenom')),
                    new ValidationInput_1.ValidationInput('Nom&nbsp;de&nbsp;famille', this.refRacine.querySelector('#champNom')),
                    new ValidationInput_1.ValidationInput('Pseudonyme', this.refRacine.querySelector('#champPseudonyme')),
                    new ValidationDateNaissance_1.ValidationDateNaissance(this.refFormulaire),
                ],
                _a[BarreProgression_1.NomEtape.InformationsConnexion] = [
                    new ValidationInput_1.ValidationInput('Numéro de téléphone', this.refRacine.querySelector('#champTelephone')),
                    new ValidationInput_1.ValidationInput('Courriel', this.refRacine.querySelector('#champCourriel')),
                    new ValidationConfirmationCourriel_1.ValidationConfirmationCourriel(this.refFormulaire),
                    new ValidationInput_1.ValidationInput('Créer un mot de passe', this.refRacine.querySelector('#champMotDePasse')),
                ],
                _a[BarreProgression_1.NomEtape.Confirmation] = [],
                _a;
        };
        Formulaire.prototype.afficherEtapeCourante = function (focusFormulaireActif) {
            var _this = this;
            if (focusFormulaireActif === void 0) { focusFormulaireActif = true; }
            var refEtapes = Array.apply(null, this.refRacine.querySelectorAll("[" + DATA_ETAPE + "]"));
            refEtapes.forEach(function (etape) {
                var nomEtape = etape.getAttribute(DATA_ETAPE);
                if (nomEtape === _this.barreProgression.nomEtapeCourante) {
                    etape.style.display = 'flex';
                    if (focusFormulaireActif) {
                        etape.focus();
                    }
                }
                else {
                    etape.style.display = 'none';
                }
            });
            this.retirerMessageErreurGeneral();
            var etapeCourante = this.barreProgression.nomEtapeCourante;
            if (etapeCourante == BarreProgression_1.NomEtape.Identification) {
                this.refBoutonSubmit.innerHTML = 'Étape suivante';
            }
            else if (etapeCourante == BarreProgression_1.NomEtape.InformationsConnexion) {
                this.refBoutonSubmit.innerHTML = "S'inscrire";
            }
            else if (etapeCourante == BarreProgression_1.NomEtape.Confirmation) {
                this.refBoutonSubmit.remove();
                this.refBoutonReset.remove();
            }
        };
        Formulaire.prototype.naviguerEtapeSuivante = function () {
            var etapeCourante = this.barreProgression.nomEtapeCourante;
            if (etapeCourante == BarreProgression_1.NomEtape.Identification) {
                this.barreProgression.modifierEtapeCourante(BarreProgression_1.NomEtape.InformationsConnexion);
            }
            else if (etapeCourante == BarreProgression_1.NomEtape.InformationsConnexion) {
                this.barreProgression.modifierEtapeCourante(BarreProgression_1.NomEtape.Confirmation);
            }
            this.afficherEtapeCourante();
        };
        Formulaire.prototype.valider = function (event) {
            var _this = this;
            event.preventDefault();
            this.controlesEnErreur = [];
            this.controles[this.barreProgression.nomEtapeCourante].forEach(function (champ) {
                if (!champ.forcerValidation()) {
                    _this.controlesEnErreur.push(champ);
                }
            });
            if (this.controlesEnErreur.length > 0) {
                this.afficherMessageErreurGeneral();
            }
            else {
                this.retirerMessageErreurGeneral();
                this.naviguerEtapeSuivante();
            }
        };
        Formulaire.prototype.reinitialiser = function () {
            var _this = this;
            Object.keys(this.controles).forEach(function (etape) {
                return _this.controles[etape].forEach(function (champ) {
                    champ.refInput.value = '';
                    champ.reinitialiser();
                });
            });
            this.barreProgression.modifierEtapeCourante(BarreProgression_1.NomEtape.Identification);
            this.controlesEnErreur = [];
            this.retirerMessageErreurGeneral();
            this.afficherEtapeCourante();
        };
        Formulaire.prototype.afficherMessageErreurGeneral = function () {
            var _this = this;
            this.refMessageErreurGeneral.innerHTML = '';
            this.refMessageErreurGeneral.style.display = 'block';
            var refH2 = document.createElement('h2');
            if (this.controlesEnErreur.length === 1) {
                refH2.innerHTML = 'Une erreur détectée';
                this.refMessageErreurGeneral.append(refH2);
                var refMessage = (document.createElement('p').innerHTML =
                    "Veuillez corriger l'erreur sur le contrôle suivant :");
                this.refMessageErreurGeneral.append(refMessage);
            }
            else {
                refH2.innerHTML =
                    "" + this.controlesEnErreur.length + ' erreurs détectées';
                this.refMessageErreurGeneral.append(refH2);
                var refMessage = (document.createElement('p').innerHTML =
                    'Veuillez corriger les erreurs sur les contrôles suivants :');
                this.refMessageErreurGeneral.append(refMessage);
            }
            this.controlesEnErreur.forEach(function (champ) {
                var refLi = document.createElement('li');
                var refA = document.createElement('a');
                refA.setAttribute('href', "#" + champ.refChamp.getAttribute('id'));
                refA.innerHTML = champ.nomEtiquette;
                refLi.append(refA);
                _this.refMessageErreurGeneral.append(refLi);
            });
            this.refMessageErreurGeneral.focus();
        };
        Formulaire.prototype.retirerMessageErreurGeneral = function () {
            this.refMessageErreurGeneral.innerHTML = '';
            this.refMessageErreurGeneral.style.display = 'none';
        };
        return Formulaire;
    }());
    exports.Formulaire = Formulaire;
});
//# sourceMappingURL=Formulaire.js.map