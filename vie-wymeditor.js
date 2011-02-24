(function($){
	$.fn.vieWymeditor = function() {
		this.each(function() {
			var elm = $(this);
			if (elm.is('div')) {
				elm.wymeditor({
					
				});
			}
		});
	}
})(jQuery);
