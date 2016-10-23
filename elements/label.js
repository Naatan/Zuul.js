class LabelElement extends BaseElement {
    
    getTemplate()
    {
        return __gulp_include(json('label.html'));
    }
    
    onCreated()
    {
    }
    
    onAttached()
    {
    }
    
    onDetached()
    {
    }
    
    onAttributeChanged(attr, oldVal, newVal) {
    }
    
}

document.registerElement('z-label', LabelElement);