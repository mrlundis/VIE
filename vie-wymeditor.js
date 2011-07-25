if (typeof VIE === 'undefined') {
    VIE = {};
}

(function($){
VIE.Wymeditor = {
    createEditable: function (element, options) {
        element = $(element);
        options = $.extend({
            beforeEditing: null
        }, options);

        element.each(function() {
            var containerInstance = VIE.RDFaEntities.getInstance(this);
            if (!containerInstance) {
                return;
            }
            containerInstance.editables = containerInstance.editables || {};

            VIE.RDFa.findPredicateElements(containerInstance.id, this, false).each(function() {
                var containerProperty = $(this);

                // Call the configured beforeEditing function that may modify 
                // the content of the editable before editing is possible
                if (_.isFunction(options.beforeEditing)) {
                    options.beforeEditing(containerProperty);
                }

                var propertyName = containerProperty.attr('property');
                if (!_.isString(propertyName)) {
                    return true;
                }

                if (_.isArray(containerInstance.get(propertyName))) {
                    // For now we don't deal with multivalued properties in Aloha
                    return true;
                }

                containerInstance.editables[propertyName] = new Wymeditor.EditableArea(this);
                containerInstance.editables[propertyName].vieContainerInstance = containerInstance;
            });
        });
    },

    refreshFromEditables: function (objectInstance) {
        var modifiedProperties = {};
        if (!objectInstance.editables) {
            return false;
        }

        // Go through editables of the model instance
        jQuery.each(objectInstance.editables, function(propertyName, editableInstance) {
            /* Not implemented yet
            if (!editableInstance.isModified()) {
                // This editable hasn't been modified, skip
                return true;
            }
            */
            // Refresh possible RDFa objects from inside the editable
            jQuery('[typeof][about]', editableInstance.obj).each(function() {
                var childInstance = VIE.RDFaEntities.getInstance(jQuery(this));
            });

            // Copy editable contents to the modifiedProperties object
            modifiedProperties[propertyName] = editableInstance.html();
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
})(jQuery);
