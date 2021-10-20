var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./ValidationInput"], function (require, exports, ValidationInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValidationDateNaissance = void 0;
    var ValidationDateNaissance = (function (_super) {
        __extends(ValidationDateNaissance, _super);
        function ValidationDateNaissance(refFormulaire) {
            var _this = _super.call(this, 'Date&nbsp;de&nbsp;naissance', refFormulaire.querySelector('#champDate')) || this;
            _this.refInput.setAttribute('max', "" + _this.obtenirDateNaissanceMinimumPourEtreAdulte());
            return _this;
        }
        ValidationDateNaissance.prototype.valider = function () {
            if (!this.estPretAEtreValide) {
                return true;
            }
            _super.prototype.valider.call(this);
            if (this.refInput.value >
                this.obtenirDateNaissanceMinimumPourEtreAdulte()) {
                this.messageErreurCourant = this.messagesErreur.requis;
                this.afficherMessageErreur();
            }
            return this.messageErreurCourant === '';
        };
        ValidationDateNaissance.prototype.obtenirDateNaissanceMinimumPourEtreAdulte = function () {
            var dateActuelle = new Date();
            var dateMinimumPourEtreAdulte = new Date(dateActuelle.setFullYear(dateActuelle.getFullYear() - 18)).toLocaleString('fr-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            return dateMinimumPourEtreAdulte;
        };
        ValidationDateNaissance.prototype.estUnAdulte = function (dateNaissance) {
            var _this = this;
            var estUnAdulte = function (dateNaissance) {
                var dateMinimumPourEtreAdulte = new Date(_this.obtenirDateNaissanceMinimumPourEtreAdulte() + " 00:00");
                var dateAniversaire = new Date(dateNaissance + " 00:00");
                return (dateMinimumPourEtreAdulte.getTime() >= dateAniversaire.getTime());
            };
            return;
        };
        return ValidationDateNaissance;
    }(ValidationInput_1.ValidationInput));
    exports.ValidationDateNaissance = ValidationDateNaissance;
});
//# sourceMappingURL=ValidationCourriels.js.map