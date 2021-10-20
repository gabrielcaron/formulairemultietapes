define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BarreProgression = exports.NomEtape = exports.EVENT_NAVIGUER_ETAPE_SELECTIONNEE = void 0;
    exports.EVENT_NAVIGUER_ETAPE_SELECTIONNEE = 'naviguerEtapeSelectionnee';
    var NomEtape;
    (function (NomEtape) {
        NomEtape["Identification"] = "identification";
        NomEtape["InformationsConnexion"] = "informations-connexion";
        NomEtape["Confirmation"] = "confirmation";
    })(NomEtape = exports.NomEtape || (exports.NomEtape = {}));
    var EtatEtape;
    (function (EtatEtape) {
        EtatEtape["Complet"] = "complet";
        EtatEtape["Courant"] = "courant";
        EtatEtape["Desactive"] = "desactive";
    })(EtatEtape || (EtatEtape = {}));
    var CLASS_RACINE = 'barre-progression';
    var CLASS_ETAPE = CLASS_RACINE + "__etape";
    var CLASS_ETAPE_COMPLETEE = CLASS_ETAPE + "--completee";
    var CLASS_ETAPE_COURANTE = CLASS_ETAPE + "--courante";
    var CLASS_ETIQUETTE = CLASS_RACINE + "__etiquette";
    var CLASS_VISUALLY_HIDDEN = 'visually-hidden';
    var DATA_NOM_ETAPE = 'data-nom-etape';
    var DATA_ETAT_ETAPE = 'data-etat-etape';
    var BarreProgression = (function () {
        function BarreProgression(nomEtapeCourante) {
            var _a;
            if (nomEtapeCourante === void 0) { nomEtapeCourante = NomEtape.Identification; }
            this.etapesProgression = (_a = {},
                _a[NomEtape.Identification] = {
                    etiquette: 'Identification',
                    etat: EtatEtape.Desactive,
                },
                _a[NomEtape.InformationsConnexion] = {
                    etiquette: 'Informations de&nbsp;connexion',
                    etat: EtatEtape.Desactive,
                },
                _a[NomEtape.Confirmation] = {
                    etiquette: 'Confirmation',
                    etat: EtatEtape.Desactive,
                },
                _a);
            this.eventNaviguerEtapeSelectionnee =
                this.naviguerEtapeSelectionnee.bind(this);
            this.eventNaviguerClavierEtapeSelectionnee =
                this.naviguerClavierEtapeSelectionnee.bind(this);
            this.refRacine = this.creerRacineElement();
            this.modifierEtapeCourante(nomEtapeCourante);
        }
        BarreProgression.prototype.modifierEtapeCourante = function (nomEtapeCourante) {
            this.nomEtapeCourante = nomEtapeCourante;
            this.definirEtatEtapes();
            this.redessinerHTMLElement();
        };
        BarreProgression.prototype.creerRacineElement = function () {
            var _this = this;
            var refNav = document.createElement('nav');
            refNav.setAttribute('aria-label', 'Étapes de progression du formulaire');
            var refOl = document.createElement('ol');
            refOl.classList.add(CLASS_RACINE);
            refNav.append(refOl);
            Object.keys(this.etapesProgression).forEach(function (etape) {
                var refLi = document.createElement('li');
                refLi.classList.add(CLASS_ETAPE);
                refLi.setAttribute(DATA_NOM_ETAPE, etape);
                refLi.setAttribute(DATA_ETAT_ETAPE, _this.etapesProgression[etape].etat);
                var refSpan = document.createElement('span');
                refSpan.classList.add(CLASS_ETIQUETTE);
                refSpan.innerHTML = _this.etapesProgression[etape].etiquette;
                refLi.append(refSpan);
                refOl.append(refLi);
            });
            return refNav;
        };
        BarreProgression.prototype.definirEtatEtapes = function () {
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
        };
        BarreProgression.prototype.redessinerHTMLElement = function () {
            var _this = this;
            var refEtapes = Array.apply(null, this.refRacine.querySelectorAll("." + CLASS_ETAPE));
            refEtapes.forEach(function (etape) {
                var attributNomEtape = etape.getAttribute(DATA_NOM_ETAPE);
                var attributEtatEtape = etape.getAttribute(DATA_ETAT_ETAPE);
                var nouvelEtatEtape = _this.etapesProgression[attributNomEtape].etat;
                if (nouvelEtatEtape === attributEtatEtape) {
                    return;
                }
                var refEtiquette = etape.querySelector("." + CLASS_ETIQUETTE);
                _this.reinitialiserClassesEtAttributsEtape(etape, refEtiquette);
                _this.definirClassesEtAttributsEtape(nouvelEtatEtape, etape, refEtiquette);
            });
        };
        BarreProgression.prototype.ajouterEcouteursEvenementsEtape = function (refEtiquette) {
            refEtiquette.addEventListener('click', this.eventNaviguerEtapeSelectionnee);
            refEtiquette.addEventListener('keydown', this.eventNaviguerClavierEtapeSelectionnee);
        };
        BarreProgression.prototype.retirerEcouteursEvenementsEtape = function (refEtiquette) {
            refEtiquette.removeEventListener('click', this.eventNaviguerEtapeSelectionnee);
            refEtiquette.removeEventListener('keydown', this.eventNaviguerClavierEtapeSelectionnee);
        };
        BarreProgression.prototype.naviguerEtapeSelectionnee = function (event) {
            var refEtiquette = event.currentTarget;
            var refEtape = refEtiquette.closest("." + CLASS_ETAPE);
            this.modifierEtapeCourante(refEtape.getAttribute(DATA_NOM_ETAPE));
            this.refRacine.dispatchEvent(new CustomEvent(exports.EVENT_NAVIGUER_ETAPE_SELECTIONNEE, {
                bubbles: true,
            }));
        };
        BarreProgression.prototype.naviguerClavierEtapeSelectionnee = function (event) {
            if (event.key == 'Enter') {
                this.naviguerEtapeSelectionnee(event);
                event.preventDefault();
            }
        };
        BarreProgression.prototype.definirClassesEtAttributsEtape = function (etatEtape, refEtape, refEtiquette) {
            refEtape.setAttribute(DATA_ETAT_ETAPE, etatEtape);
            if (etatEtape === EtatEtape.Complet) {
                var refSpan = document.createElement('span');
                refSpan.classList.add('visually-hidden');
                refSpan.innerHTML = 'Étape complétée: ';
                refEtape.prepend(refSpan);
                refEtape.classList.add(CLASS_ETAPE_COMPLETEE);
                refEtiquette.setAttribute('tabindex', '0');
                refEtiquette.setAttribute('role', 'button');
                this.ajouterEcouteursEvenementsEtape(refEtiquette);
            }
            else if (etatEtape == EtatEtape.Courant) {
                refEtape.classList.add(CLASS_ETAPE_COURANTE);
                refEtape.setAttribute('aria-current', 'step');
            }
        };
        BarreProgression.prototype.reinitialiserClassesEtAttributsEtape = function (refEtape, refEtiquette) {
            refEtape.classList.remove(CLASS_ETAPE_COMPLETEE);
            refEtape.classList.remove(CLASS_ETAPE_COURANTE);
            var refVisuallyHidden = refEtape.querySelector("" + CLASS_VISUALLY_HIDDEN);
            if (refVisuallyHidden) {
                refVisuallyHidden.remove();
            }
            refEtiquette.removeAttribute('tabindex');
            refEtiquette.removeAttribute('role');
            refEtape.removeAttribute('aria-current');
            this.retirerEcouteursEvenementsEtape(refEtiquette);
        };
        return BarreProgression;
    }());
    exports.BarreProgression = BarreProgression;
});
//# sourceMappingURL=BarreProgression.js.map