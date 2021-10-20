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
    exports.ValidationCourriel = void 0;
    var ValidationCourriel = (function (_super) {
        __extends(ValidationCourriel, _super);
        function ValidationCourriel(refFormulaire) {
            var _this = _super.call(this, 'Courriel', refFormulaire.querySelector('#champCourriel')) || this;
            _this.refChampConfirmationCourriel = null;
            _this.refChampConfirmationCourriel = refFormulaire.querySelector('#champConfirmationCourriel');
            return _this;
        }
        ValidationCourriel.prototype.valider = function () {
            if (!this.estPretAEtreValide) {
                return true;
            }
            if (_super.prototype.valider.call(this)) {
                if (this.refInput.value !=
                    this.refChampConfirmationCourriel.querySelector('input')
                        .value &&
                    this.refChampConfirmationCourriel.querySelector('input')
                        .value != '') {
                    this.messageErreurCourant =
                        'Le courriel et la confirmation du courriel doivent être identiques.';
                    this.afficherMessageErreur();
                }
            }
            return this.messageErreurCourant === '';
        };
        return ValidationCourriel;
    }(ValidationInput_1.ValidationInput));
    exports.ValidationCourriel = ValidationCourriel;
});
//# sourceMappingURL=ValidationCourriel.js.map