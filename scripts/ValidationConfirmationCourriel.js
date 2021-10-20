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
    exports.ValidationConfirmationCourriel = void 0;
    var ValidationConfirmationCourriel = (function (_super) {
        __extends(ValidationConfirmationCourriel, _super);
        function ValidationConfirmationCourriel(refFormulaire) {
            var _this = _super.call(this, 'Confirmation du courriel', refFormulaire.querySelector('#champConfirmationCourriel')) || this;
            _this.refChampCourriel = null;
            _this.refChampCourriel = refFormulaire.querySelector('#champCourriel');
            return _this;
        }
        ValidationConfirmationCourriel.prototype.valider = function () {
            if (!this.estPretAEtreValide) {
                return true;
            }
            if (_super.prototype.valider.call(this)) {
                if (this.refInput.value !=
                    this.refChampCourriel.querySelector('input').value &&
                    this.refChampCourriel.querySelector('input').value != '') {
                    this.messageErreurCourant =
                        'Le champ Confirmation du courriel doit être identique au champ Courriel.';
                    this.afficherMessageErreur();
                }
            }
            return this.messageErreurCourant === '';
        };
        return ValidationConfirmationCourriel;
    }(ValidationInput_1.ValidationInput));
    exports.ValidationConfirmationCourriel = ValidationConfirmationCourriel;
});
//# sourceMappingURL=ValidationConfirmationCourriel.js.map