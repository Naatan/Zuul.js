"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parsePx = function parsePx(val) {
    return isNaN(val) ? val : val + "px";
};

var BaseElement = function (_HTMLElement) {
    _inherits(BaseElement, _HTMLElement);

    function BaseElement() {
        _classCallCheck(this, BaseElement);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseElement).apply(this, arguments));
    }

    _createClass(BaseElement, [{
        key: "getTemplate",
        value: function getTemplate() {
            return false;
        }

        // Fires when an instance of the element is created.

    }, {
        key: "createdCallback",
        value: function createdCallback() {
            if (this.hasAttribute("flex")) this.style.flexGrow = this.getAttribute("flex");

            if (this.hasAttribute("height")) this.style.height = parsePx(this.getAttribute("height"));

            if (this.hasAttribute("width")) this.style.width = parsePx(this.getAttribute("width"));

            var template = this.getTemplate();
            if (template) {
                template = "<template>" + template + "</template>";
                var d = document.createElement('div');
                d.innerHTML = template;
                template = d.firstChild;

                this._shadowRoot = this.createShadowRoot();
                var vdom = document.importNode(template.content, true);
                this._shadowRoot.appendChild(vdom);
            }

            if ("onCreated" in this) this.onCreated.apply(this, arguments);
        }

        // Fires when an instance was inserted into the document.

    }, {
        key: "attachedCallback",
        value: function attachedCallback() {
            if ("onAttached" in this) this.onAttached.apply(this, arguments);
        }

        // Fires when an instance was removed from the document.

    }, {
        key: "detachedCallback",
        value: function detachedCallback() {
            if ("onDetached" in this) this.onDetached.apply(this, arguments);
        }

        // Fires when an attribute was added, removed, or updated.

    }, {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(attr, oldVal, newVal) {
            if (attr == "flex") this.style.flexGrow = newVal;

            if (attr == "height") this.style.height = parsePx(newVal);

            if (attr == "width") this.style.width = parsePx(newVal);

            if ("onAttributeChanged" in this) this.onAttributeChanged.apply(this, arguments);
        }
    }]);

    return BaseElement;
}(HTMLElement);

var BoxElement = function (_BaseElement) {
    _inherits(BoxElement, _BaseElement);

    function BoxElement() {
        _classCallCheck(this, BoxElement);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BoxElement).apply(this, arguments));
    }

    return BoxElement;
}(BaseElement);

var HboxElement = function (_BoxElement) {
    _inherits(HboxElement, _BoxElement);

    function HboxElement() {
        _classCallCheck(this, HboxElement);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(HboxElement).apply(this, arguments));
    }

    return HboxElement;
}(BoxElement);

var VboxElement = function (_BoxElement2) {
    _inherits(VboxElement, _BoxElement2);

    function VboxElement() {
        _classCallCheck(this, VboxElement);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(VboxElement).apply(this, arguments));
    }

    return VboxElement;
}(BoxElement);

document.registerElement('z-box', BoxElement);
document.registerElement('z-hbox', HboxElement);
document.registerElement('z-vbox', VboxElement);
document.registerElement('z-sample', BaseElement);

var LabelElement = function (_BaseElement2) {
    _inherits(LabelElement, _BaseElement2);

    function LabelElement() {
        _classCallCheck(this, LabelElement);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(LabelElement).apply(this, arguments));
    }

    _createClass(LabelElement, [{
        key: "getTemplate",
        value: function getTemplate() {
            return "<style>\n    \n</style>\n\n<span><content></content></span>\n";
        }
    }, {
        key: "onCreated",
        value: function onCreated() {}
    }, {
        key: "onAttached",
        value: function onAttached() {}
    }, {
        key: "onDetached",
        value: function onDetached() {}
    }, {
        key: "onAttributeChanged",
        value: function onAttributeChanged(attr, oldVal, newVal) {}
    }]);

    return LabelElement;
}(BaseElement);

document.registerElement('z-label', LabelElement);