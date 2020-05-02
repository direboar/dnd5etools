"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UdonariumCharacter {
    constructor() {
        this.common = null;
        this.imageHashSHA256 = null;
        this.details = [];
        this.chatpallette = null;
    }
    addDetail(detail) {
        this.details.push(detail);
    }
}
exports.UdonariumCharacter = UdonariumCharacter;
class Common {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
}
exports.Common = Common;
class Detail {
    constructor(label) {
        this.detailItems = [];
        this.label = label;
    }
    addDetailItem(item) {
        this.detailItems.push(item);
    }
}
exports.Detail = Detail;
class DetailItem {
    constructor(name) {
        this.name = name;
    }
}
exports.DetailItem = DetailItem;
class NormalResource extends DetailItem {
    constructor(name, contents) {
        super(name);
        this.contents = contents;
    }
    createNode(parent) {
        const node = parent.node("data").attr({ name: this.name });
        node.text(this.contents);
        return node;
    }
}
exports.NormalResource = NormalResource;
class NoteResource extends DetailItem {
    constructor(name, contents) {
        super(name);
        this.contents = contents;
    }
    createNode(parent) {
        const node = parent.node("data").attr({ name: this.name, type: "note" });
        node.text(this.contents);
        return node;
    }
}
exports.NoteResource = NoteResource;
class NumberResource extends DetailItem {
    constructor(name, currentValue, maxValue) {
        super(name);
        this.currentValue = currentValue;
        this.maxValue = maxValue;
    }
    createNode(parent) {
        const node = parent.node("data").attr({ name: this.name, type: "numberResource", currentValue: this.currentValue });
        node.text(this.maxValue);
        return node;
    }
}
exports.NumberResource = NumberResource;
class ContainerItem extends DetailItem {
    constructor(name) {
        super(name);
        this.detailItems = [];
    }
    addDetailItem(item) {
        this.detailItems.push(item);
    }
    createNode(parent) {
        const node = parent.node("data").attr({ name: this.name });
        this.detailItems.forEach(detailItem => {
            detailItem.createNode(node);
        });
    }
}
exports.ContainerItem = ContainerItem;
class ChatPallette {
    constructor(dicebot, contents) {
        this.dicebot = dicebot;
        this.contents = contents;
    }
}
exports.Chatpallette = ChatPallette;
//# sourceMappingURL=UdonariumCharacter.js.map