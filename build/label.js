class LabelElement extends BaseElement {
    
    getTemplate()
    {
        return "<style>\n    \n</style>\n\n<span><content></content></span>\n";
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