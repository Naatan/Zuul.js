"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Zuul = function () {
    function Zuul() {
        _classCallCheck(this, Zuul);

        this.elements = {};
    }

    _createClass(Zuul, [{
        key: "registerElement",
        value: function registerElement(element) {
            if (element.name in this.elements) return console.error("Element " + element.name + " has already been registered");

            this.elements[element.name] = element;
        }
    }, {
        key: "getElement",
        value: function getElement(name) {
            return this.elements[name] || null;
        }
    }]);

    return Zuul;
}();

var zuul = new Zuul();

var ZuulHelpers = function () {
    function ZuulHelpers() {
        _classCallCheck(this, ZuulHelpers);
    }

    _createClass(ZuulHelpers, [{
        key: "parsePx",
        value: function parsePx(val) {
            return isNaN(val) ? val : val + "px";
        }
    }]);

    return ZuulHelpers;
}();

var zuulHelpers = new ZuulHelpers();

var BaseElement = function (_HTMLElement) {
    _inherits(BaseElement, _HTMLElement);

    function BaseElement() {
        _classCallCheck(this, BaseElement);

        return _possibleConstructorReturn(this, (BaseElement.__proto__ || Object.getPrototypeOf(BaseElement)).apply(this, arguments));
    }

    _createClass(BaseElement, [{
        key: "createdCallback",


        // Fires when an instance of the element is created.
        value: function createdCallback() {
            if (this.hasAttribute("flex")) this.style.flexGrow = this.getAttribute("flex");

            if (this.hasAttribute("height")) this.style.height = zuulHelpers.parsePx(this.getAttribute("height"));

            if (this.hasAttribute("width")) this.style.width = zuulHelpers.parsePx(this.getAttribute("width"));

            var element = this.nodeName.replace(/^Z-/, "");
            element = element[0].toUpperCase() + element.slice(1).toLowerCase();
            var template = document.querySelector("z-element[element=\"" + element + "Element\"] template");
            if (template) {
                template = template.cloneNode(true);
                this._shadowRoot = this.attachShadow({ mode: 'open' });
                this._shadowRoot.appendChild(template.content);
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

            if (attr == "height") this.style.height = zuulHelpers.parsePx(newVal);

            if (attr == "width") this.style.width = zuulHelpers.parsePx(newVal);

            if ("onAttributeChanged" in this) this.onAttributeChanged.apply(this, arguments);
        }
    }]);

    return BaseElement;
}(HTMLElement);

var ImportElement = function (_BaseElement) {
    _inherits(ImportElement, _BaseElement);

    function ImportElement() {
        _classCallCheck(this, ImportElement);

        return _possibleConstructorReturn(this, (ImportElement.__proto__ || Object.getPrototypeOf(ImportElement)).apply(this, arguments));
    }

    _createClass(ImportElement, [{
        key: "onAttached",
        value: function onAttached() {
            var wrapper = document.getElementById("__zuul-elements");
            if (!wrapper) {
                wrapper = document.createElement("div");
                wrapper.setAttribute("id", "__zuul-elements");
                wrapper.setAttribute("css", "display: none");
                document.body.appendChild(wrapper);
            }

            var http = new XMLHttpRequest();
            http.open('get', this.getAttribute("href"));
            http.onreadystatechange = handleResponse;
            http.send(null);

            function handleResponse() {
                if (http.readyState == 4) {
                    wrapper.insertAdjacentHTML("beforeend", http.responseText.trim());
                }
            }
        }
    }]);

    return ImportElement;
}(BaseElement);

var ZElement = function (_HTMLElement2) {
    _inherits(ZElement, _HTMLElement2);

    function ZElement() {
        _classCallCheck(this, ZElement);

        return _possibleConstructorReturn(this, (ZElement.__proto__ || Object.getPrototypeOf(ZElement)).apply(this, arguments));
    }

    _createClass(ZElement, [{
        key: "createdCallback",


        // Fires when an instance of the element is created.
        value: function createdCallback() {
            this.name = this.getAttribute("element");

            if (!this.name) return console.error("z-element is missing element attribute");

            if (this.hasAttribute("extends")) {
                this.extend(this.getAttribute("extends"));
            }

            var script = this.getScript();
            if (script) {
                var newScript = document.createElement("script");
                newScript.innerHTML = script.innerText;
                script.parentNode.replaceChild(newScript, script); // Force run script
            }

            zuul.registerElement(this);
        }
    }, {
        key: "appendToTemplate",
        value: function appendToTemplate(element) {
            this.querySelector("template").content.appendChild(element);
        }
    }, {
        key: "getScript",
        value: function getScript() {
            return this.querySelector("script");
        }
    }, {
        key: "getTemplate",
        value: function getTemplate() {
            return this.querySelector("template").content;
        }
    }, {
        key: "getStyleAsArray",
        value: function getStyleAsArray() {
            var result = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.getTemplate().childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var element = _step.value;

                    if (element.nodeName == "STYLE") result.push(element);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result;
        }
    }, {
        key: "getMarkupAsArray",
        value: function getMarkupAsArray() {
            var result = [];

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.getTemplate().childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var element = _step2.value;

                    if (element.nodeName != "STYLE" && element.nodeName != "#text") result.push(element);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return result;
        }
    }, {
        key: "extend",
        value: function extend(name) {
            var element = zuul.getElement(name);

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = element.getStyleAsArray()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _child = _step3.value;

                    console.log("Append Style");
                    this.appendToTemplate(_child.cloneNode(true));
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (!this.getMarkupAsArray().length) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = element.getMarkupAsArray()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var child = _step4.value;

                        this.appendToTemplate(child.cloneNode(true));
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }

            var script = this.getScript();
            var parentScript = element.getScript();
            if (script) {
                var rx = new RegExp("(class\\s+" + this.name + ")(\\s*(?:{|$))");
                script.innerText = script.innerText.replace(rx, "$1 extends " + name + "$2");
            } else if (parentScript) {
                this.appendChild(parentScript.cloneNode(true));
            }
        }
    }]);

    return ZElement;
}(HTMLElement);

document.registerElement('z-import', ImportElement);
document.registerElement('z-element', ZElement);