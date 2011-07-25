(function($){
    $.fn.vieSemanticAloha = function(options) {
        
        // Default settings
        var opt = { 
                beforeEditing: null
        };
        $.extend(opt, options);

        this.each(function() {
            var containerInstance = VIE.RDFaEntities.getInstance(jQuery(this));
            if (!containerInstance) {
                return;
            }
            if (typeof containerInstance.editables === 'undefined') {
                containerInstance.editables = {};
            }

            VIE.RDFa.findPredicateElements(containerInstance.id, this, false).each(function() {
                var containerProperty = jQuery(this);

                // Call the configured beforeEditing function that may modify 
                // the content of the editable before editing is possible
                if (opt.beforeEditing !== null) {
                    opt.beforeEditing(containerProperty);
                }

                var propertyName = containerProperty.attr('property');
                if (propertyName === undefined) {
                    return true;
                }

                if (containerInstance.get(propertyName) instanceof Array) {
                    // For now we don't deal with multivalued properties in Aloha
                    return true;
                }

                if (typeof Aloha === "undefined") { Aloha = GENTICS.Aloha; }
                containerInstance.editables[propertyName] = new Aloha.Editable(containerProperty);
                containerInstance.editables[propertyName].vieContainerInstance = containerInstance;
            });
        });
    };
})(jQuery);

if (typeof VIE === 'undefined') {
    VIE = {};
}

VIE.AlohaEditable = {
    refreshFromEditables: function(objectInstance) {
        var modifiedProperties = {};
        if (!objectInstance.editables) {
            return false;
        }

        // Go through editables of the model instance
        jQuery.each(objectInstance.editables, function(propertyName, editableInstance) {
            if (!editableInstance.isModified()) {
                // This editable hasn't been modified, skip
                return true;
            }

            // Refresh possible RDFa objects from inside the editable
            jQuery('[typeof][about]', editableInstance.obj).each(function() {
                var childInstance = VIE.RDFaEntities.getInstance(jQuery(this));
            });

            // Copy editable contents to the modifiedProperties object
            modifiedProperties[propertyName] = editableInstance.getContents();
        });

        if (jQuery.isEmptyObject(modifiedProperties))
        {
            // No modified editables for this object, skip
            return false;
        }
        // Set the modified properties to the model instance
        objectInstance.set(modifiedProperties);
        return true;
    }
};
