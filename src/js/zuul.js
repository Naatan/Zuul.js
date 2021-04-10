class Zuul {
    
    constructor()
    {
        this.loaded = false;
        this.elements = {};
        this._importQueue = [];
    }
    
    registerElement(element)
    {
        if (element.name in this.elements)
            return console.error(`Element ${element.name} has already been registered`);

        this.elements[element.name] = element;

        var event = new CustomEvent(`registered_${element.name}`);
        document.dispatchEvent(event);

        console.debug(`Registered ${element.name}`);
    }

    getElement(name)
    {
        return this.elements[name] || null;
    }

    get importQueue()
    {
        return this._importQueue;
    }
    
    set importQueue(value)
    {
        this._importQueue = value;
        
        // If the queue is complete fire a load event when ready
        if ( ! this._importQueue.length && ! this.loaded)
        {
            var fireLoadEvent = () =>
            {
                delete this._loadedTimer;
                zuulHelpers.fire(window, "z-load");
            };

            if (document.readyState == "complete")
            {
                this._loadedTimer = setTimeout(fireLoadEvent, 50);
            }
            else
            {
                window.addEventListener("load", fireLoadEvent);
            }
        }
        else if (this._loadedTimer)
        {
            clearTimeout(this._loadedTimer);
        }
    }
}
var zuul = new Zuul();

class ZuulHelpers {
    
    parsePx(val)
    {
        return isNaN(val) ? val : val + "px";
    }

    fire(element, name)
    {
        var event = document.createEvent("HTMLEvents");
        event.initEvent(name, true, true);
        event.name = name;
        element.dispatchEvent(event);
    }

    bool(value)
    {
        return value != "0" && value != "false" && !! value;
    }

    getCssVariable(element, name)
    {
        var style = window.getComputedStyle(element);
        return style.getPropertyValue(`--${name}`).trim();
    }
    
}
var zuulHelpers = new ZuulHelpers();

class ImportElement extends HTMLElement {

    connectedCallback()
    {
        var wrapper = document.getElementById("__zuul-elements");
        if ( ! wrapper)
        {
            wrapper = document.createElement("div");
            wrapper.setAttribute("id", "__zuul-elements");
            wrapper.setAttribute("css", "display: none");
            document.body.appendChild(wrapper);
        }
        
        var path = "";
        if (this.hasAttribute("path"))
        {
            path = this.getAttribute("path");
        }

        var hrefs = [];
        if (this.hasAttribute("href"))
        {
            hrefs = this.getAttribute("href").split(",");
        }
        else if (this.hasAttribute("preset"))
        {
            hrefs = ImportElement.preset[this.getAttribute("preset")] || [];
        }
        
        hrefs.forEach((href) =>
        {
            zuul.importQueue.push(href);
            
            var http = new XMLHttpRequest();
            http.open('get', path + href);
            http.onreadystatechange = handleResponse;
            http.send(null);
    
            function handleResponse()
            {
                if (http.readyState == 4)
                {
                    wrapper.insertAdjacentHTML("beforeend", http.responseText.trim());
                    zuul.importQueue = zuul.importQueue.filter((v) => v != href);
                }
            }
        });
    }
}

ImportElement.preset = {
    "zuul": [
        "elements/base.html",
        "elements/box.html",
        "elements/vbox.html",
        "elements/hbox.html",
        "elements/label.html",
        "elements/listbox.html",
        "elements/listitem.html",
        "elements/checkbox.html",
        "elements/radiogroup.html",
        "elements/radio.html",
        "elements/textbox.html",
    ]
};

class ZElement extends HTMLElement {

    // Fires when an instance of the element is created.
    constructor()
    {
      super();
      this.create();
    }

    create()
    {
        this.name = this.getAttribute("name");

        console.debug(`Created ${this.name} base element`);

        var dependsOn = [];
        if (this.hasAttribute("extends"))
            dependsOn = dependsOn.concat(this.getAttribute("extends").split(","));
        if (this.hasAttribute("depends"))
            dependsOn = dependsOn.concat(this.getAttribute("depends").split(","));

        // Ensure the elements this one depends on are ready before creating this one
        if (dependsOn.length)
        {
            for (let parent of dependsOn)
            {
                if ( ! zuul.getElement(parent))
                {
                    var timer = setInterval(() => console.warn(`Still waiting for ${parent} ..`), 5000);
                    var args = Array.prototype.slice(arguments, 0);
                    document.addEventListener(`registered_${parent}`, () =>
                    {
                        clearInterval(timer);
                        this.create.apply(this, args);
                    });
                    return;
                }
            }
        }
        
        if ( ! this.name)
            return console.error("z-element is missing element attribute");

        if (this.hasAttribute("extends"))
        {
            var isPrimary = true;
            for (let parent of this.getAttribute("extends").split(","))
            {
                this.extend(parent, isPrimary);
                isPrimary = false;
            }
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
        var parent = this.querySelector("template").content;
        var firstChild = parent.childNodes[0];
        
        if ( ! firstChild)
        {
            parent.appendChild(element);
        }
        else
        {
            parent.insertBefore(element, firstChild);
        }
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
        
        var template = this.getTemplate();
        if ( ! template || ! template.childNodes)
            return [];

        for (let element of template.childNodes)
        {
            if (element.nodeName == "STYLE")
                result.push(element);
        }
        
        return result;
    }
    
    getMarkupAsArray()
    {
        var result = [];
        
        var template = this.getTemplate();
        if ( ! template || ! template.childNodes)
            return [];

        for (let element of template.childNodes)
        {
            if (element.nodeName != "STYLE" && element.nodeName != "#text")
                result.push(element);
        }
        
        return result;
    }
    
    extend(name, isPrimary = false)
    {
        var element = zuul.getElement(name);
        var parentScript;

        if (element)
        {
            for (let child of element.getStyleAsArray())
            {
                this.appendToTemplate(child.cloneNode(true));
            }

            if ( ! this.getMarkupAsArray().length)
            {
                for (let child of element.getMarkupAsArray())
                {
                    this.appendToTemplate(child.cloneNode(true));
                }
            }

            parentScript = element.getScript();
        }
        
        if (isPrimary)
        {
            var script = this.getScript();
            if ( ! script && parentScript)
            {
                this.appendChild(parentScript.cloneNode(true));
            }
        }
    }
    
}

customElements.define('z-import', ImportElement);
customElements.define('z-element', ZElement);
