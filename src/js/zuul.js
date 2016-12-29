class Zuul {
    
    constructor()
    {
        this.elements = {};
    }
    
    registerElement(element)
    {
        if (element.name in this.elements)
            return console.error(`Element ${element.name} has already been registered`);
        
        this.elements[element.name] = element;
    }
    
    getElement(name)
    {
        return this.elements[name] || null;
    }
    
}
var zuul = new Zuul();

class ZuulHelpers {
    
    parsePx(val)
    {
        return isNaN(val) ? val : val + "px";
    }
    
}
var zuulHelpers = new ZuulHelpers();

class BaseElement extends HTMLElement {
    
    // Fires when an instance of the element is created.
    createdCallback()
    {
        if (this.hasAttribute("flex"))
            this.style.flexGrow = this.getAttribute("flex");
        
        if (this.hasAttribute("height"))
            this.style.height = zuulHelpers.parsePx(this.getAttribute("height"));
        
        if (this.hasAttribute("width"))
            this.style.width = zuulHelpers.parsePx(this.getAttribute("width"));
        
        var element = this.nodeName.replace(/^Z-/, "");
        element = element[0].toUpperCase() + element.slice(1).toLowerCase();
        var template = document.querySelector(`z-element[element="${element}Element"] template`);
        if (template)
        {
            template = template.cloneNode(true);
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(template.content);
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
            this.style.height = zuulHelpers.parsePx(newVal);
            
        if (attr == "width")
            this.style.width = zuulHelpers.parsePx(newVal);
            
        if ("onAttributeChanged" in this)
            this.onAttributeChanged.apply(this, arguments);
    }
    
}

class ImportElement extends BaseElement {
    
    onAttached()
    {
        var wrapper = document.getElementById("__zuul-elements");
        if ( ! wrapper)
        {
            wrapper = document.createElement("div");
            wrapper.setAttribute("id", "__zuul-elements");
            wrapper.setAttribute("css", "display: none");
            document.body.appendChild(wrapper);
        }
        
        var http = new XMLHttpRequest();
        http.open('get', this.getAttribute("href"));
        http.onreadystatechange = handleResponse;
        http.send(null);

        function handleResponse()
        {
            if (http.readyState == 4)
            {
                wrapper.insertAdjacentHTML("beforeend", http.responseText.trim());
            }
        }
    }
}

class ZElement extends HTMLElement {
    
    // Fires when an instance of the element is created.
    createdCallback()
    {
        this.name = this.getAttribute("element");
        
        if ( ! this.name)
            return console.error("z-element is missing element attribute");

        if (this.hasAttribute("extends"))
        {
            this.extend(this.getAttribute("extends"));
        }
        
        var script = this.getScript();
        if (script)
        {
            var newScript = document.createElement("script");
            newScript.innerHTML = script.innerText;
            script.parentNode.replaceChild(newScript, script); // Force run script
        }
        
        zuul.registerElement(this);
    }
    
    appendToTemplate(element)
    {
        this.querySelector("template").content.appendChild(element);
    }
    
    getScript()
    {
        return this.querySelector("script");
    }
    
    getTemplate()
    {
        return this.querySelector("template").content;
    }
    
    getStyleAsArray()
    {
        var result = [];
        
        for (let element of this.getTemplate().childNodes)
        {
            if (element.nodeName == "STYLE")
                result.push(element);
        }
        
        return result;
    }
    
    getMarkupAsArray()
    {
        var result = [];
        
        for (let element of this.getTemplate().childNodes)
        {
            if (element.nodeName != "STYLE" && element.nodeName != "#text")
                result.push(element);
        }
        
        return result;
    }
    
    extend(name)
    {
        var element = zuul.getElement(name);
        
        for (let child of element.getStyleAsArray())
        {
            console.log("Append Style");
            this.appendToTemplate(child.cloneNode(true));
        }
        
        if ( ! this.getMarkupAsArray().length)
        {
            for (let child of element.getMarkupAsArray())
            {
                this.appendToTemplate(child.cloneNode(true));
            }
        }
        
        var script = this.getScript();
        var parentScript = element.getScript();
        if (script)
        {
            var rx = new RegExp("(class\\s+" + this.name + ")(\\s*(?:{|$))");
            script.innerText = script.innerText.replace(rx, `$1 extends ${name}$2`);
        }
        else if (parentScript)
        {
            this.appendChild(parentScript.cloneNode(true));
        }
    }
    
}

document.registerElement('z-import', ImportElement);
document.registerElement('z-element', ZElement);
