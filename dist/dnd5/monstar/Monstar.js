"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monstar {
    constructor() {
        this.name = "";
        this.size = Size.Medium;
        this.AC = 0;
        this.speed = "";
        this.type = "";
        this.alignment = "";
        this.damageImmunes = "";
        this.conditionImmunes = "";
        this.sence = "";
        this.language = "";
        this.challenges = "";
        this.hitPoint = 0;
        this.imageUrl = "";
        this.STR = new Ability();
        this.DEX = new Ability();
        this.CON = new Ability();
        this.INT = new Ability();
        this.WIS = new Ability();
        this.CHA = new Ability();
        this.treats = [];
        this.actions = [];
    }
}
exports.Monstar = Monstar;
class Ability {
    constructor(value, modifier, save) {
        this.value = value ? value : 0;
        this.modifier = modifier ? modifier : "";
        this.save = save ? save : "0";
    }
}
exports.Ability = Ability;
class TreatsAndAction {
    constructor(name) {
        this.contents = [];
        this.name = name ? name : "";
    }
}
exports.TreatsAndAction = TreatsAndAction;
var Size;
(function (Size) {
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Large"] = 2] = "Large";
    Size[Size["Huge"] = 3] = "Huge";
})(Size || (Size = {}));
exports.Size = Size;
//# sourceMappingURL=Monstar.js.map