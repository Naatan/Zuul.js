var parsePx = (val) =>
{
    return isNaN(val) ? val : val + "px";
};

class BaseElement extends HTMLElement {
    
    getTemplate()
    {
        return false;
    }
    
    // Fires when an instance of the element is created.
    createdCallback()
    {
        if (this.hasAttribute("flex"))
            this.style.flexGrow = this.getAttribute("flex");
        
        if (this.hasAttribute("height"))
            this.style.height = parsePx(this.getAttribute("height"));
        
        if (this.hasAttribute("width"))
            this.style.width = parsePx(this.getAttribute("width"));
        
        var template = this.getTemplate();
        if (template)
        {
            template = `<template>${template}</template>`;
            var d = document.createElement('div');
            d.innerHTML = template;
            template = d.firstChild;
            
            this._shadowRoot = this.createShadowRoot();
            var vdom = document.importNode(template.content, true);
            this._shadowRoot.appendChild(vdom);
        }
        
        if ("onCreated" in this)
            this.onCreated.apply(this, arguments);
    }
    
    // Fires when an instance was inserted into the document.
    attachedCallback()
    {
        if ("onAttached" in this)
            this.onAttached.apply(this, arguments);
    }
    
    // Fires when an instance was removed from the document.
    detachedCallback()
    {
        if ("onDetached" in this)
            this.onDetached.apply(this, arguments);
    }
    
    // Fires when an attribute was added, removed, or updated.
    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr == "flex")
            this.style.flexGrow = newVal;
            
        if (attr == "height")
            this.style.height = parsePx(newVal);
            
        if (attr == "width")
            this.style.width = parsePx(newVal);
            
        if ("onAttributeChanged" in this)
            this.onAttributeChanged.apply(this, arguments);
    }
    
}

class BoxElement extends BaseElement {
    
}

class HboxElement extends BoxElement {

}

class VboxElement extends BoxElement {

}

document.registerElement('z-box', BoxElement);
document.registerElement('z-hbox', HboxElement);
document.registerElement('z-vbox', VboxElement);
document.registerElement('z-sample', BaseElement);

__gulp_include('label.js')