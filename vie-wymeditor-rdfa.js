(function($){
	$.fn.vieWymeditor = function() {
		this.each(function() {
			var containerInstance = VIE.ContainerManager.getInstanceForContainer(jQuery(this));
			containerInstance.editables = {};
			jQuery(containerInstance.view.el).find('[property]').each(function() {
				var containerProperty = jQuery(this);
				var propertyName = containerProperty.attr('property');
				if (containerProperty.is('div')) {
					containerProperty.wymeditor({
						html: containerProperty.html(),
						stylesheet: 'vie-wymeditor-rdfa-stylesheet.css',
						postInit: function (wym) {
							containerInstance.editables[propertyName] = wym;
							wym.vieContainerInstance = containerInstance;
							
                            //add the namespaces
                            jQuery('html', wym._doc)
                                .attr('xmlns', 'http://www.w3.org/1999/xhtml')
                                .attr('xmlns:foaf', 'http://xmlns.com/foaf/0.1/')
                                .attr('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
                                .attr('version', 'XHTML+RDFa 1.0')
                                .attr('xml:lang', 'en');

                            //construct the RDF export button's html
                            var html = '<li class="wym_tools_rdfexport">'
                                     + '<a href="#"'
                                     + ' style="background-image: none; text-indent: 0px; width: auto;">'
                                     + 'RDF'
                                     + '</a></li>';

                            //add the button to the tools box
                            jQuery(wym._box)
                                .find(wym._options.toolsSelector + wym._options.toolsListSelector)
                                .append(html);

                            //handle click event on RDF export button
                            //using rdfquery - http://code.google.com/p/rdfquery/
                            jQuery(wym._box)
                                .find('li.wym_tools_rdfexport a')
                                .click(function() {
                                    alert(jQuery(wym._doc.body).rdf()
                                      .databank
                                      .dump({format:'application/rdf+xml', serialize: true}));
                                });

                            //set the classes panel as dropdown
                            jQuery(wym._box).find('div.wym_classes')
                                .addClass('wym_dropdown')
                                .find(WYMeditor.H2)
                                .append("<span>&nbsp;&gt;<\/span>");

                            //construct the panel
                            jQuery(wym._box).find('div.wym_area_right')
                                .append('<div class="wym_attributes wym_section wym_panel"><\/div>')
                                .children(':last')
                                .append('<h2>Attributes<\/h2>')
                                .append('<ul><\/ul>')
                                .children(':last')
                                //store the attribute name/value in the button class (better idea?)
                                .append('<li><a class="about" title="What the data is about." href="#">ABOUT: about #value#<\/a><\/li>')
                                .append('<li><a class="property dc_title" title="A name by which the resource is formally known." href="#">TITLE: prop dc:title<\/a><\/li>')
                                .append('<li><a class="property dc_creator" title="An entity primarily responsible for making the resource." href="#">CREATOR: prop dc:creator<\/a><\/li>')
                                .append('<li><a class="typeof foaf_Person" title="A person." href="#">PERSON: typeof foaf:Person<\/a><\/li>')
                                .append('<li><a class="property foaf_name" title="A name for some thing." href="#">NAME: property foaf:name<\/a><\/li>')
                                .append('<li><a class="rel foaf_homepage" title="A homepage for some thing." href="#">HOMEPAGE: rel foaf:homepage<\/a><\/li>')
                                .find('a')
                                //event handlers
                                .click( function() {

                                    //init
                                    var selected  = wym.selected(),                         //selected container
                                        classes   = jQuery(this).attr('class').split(' '),  //clicked button classes
                                        attrName  = classes[0],                             //attribute name, e.g. 'property'
                                        attrValue = classes.length > 1 ? classes[1] : null; //attribute value, if available, e.g. dc_title

                                    //the attribute already exists, remove it
                                    if( jQuery(selected).attr(attrName) != undefined && jQuery(selected).attr(attrName) != '') {
                                        WYMeditor.console.log('attribute already exists, remove it:', attrName, jQuery(selected).attr(attrName));
                                        if( classes.length == 1 || jQuery(selected).attr(attrName) == attrValue.replace('_', ':') )
                                            jQuery(selected).removeAttr(attrName).removeClass(attrName).removeClass(attrValue);

                                    //else, add it (and the feedback class)
                                    } else {
                                        WYMeditor.console.log('attribute does not exist, add it:', attrName, attrValue);
                                        if( classes.length > 1 ) { //value available
                                            jQuery(selected).attr(attrName, attrValue.replace('_', ':')).addClass(attrValue);
                                        } else { //value not available
                                            attrValue = prompt('Value', '');
                                            if(attrValue != null) jQuery(selected).attr(attrName, attrValue).addClass(attrName);
                                        }
                                    }
                                    
                                    return false;
                                });

                            //feedback css
                            var rules = [
                              { name: '.about',
                                css: 'background-color: #f99;' },
                              { name: '.dc_creator',
                                css: 'background-color: #9f9;' },
                              { name: '.dc_title',
                                css: 'background-color: #9ff;' },
                              { name: '.foaf_Person',
                                css: 'background-color: #69c;' },
                              { name: '.foaf_name',
                                css: 'background-color: #99c;' },
                              { name: '.foaf_homepage',
                                css: 'background-color: #c9c;' }
                            ];
                            wym.addCssRules( wym._doc, rules);
						}
					});
				}
			});
		})
	}
})(jQuery);
