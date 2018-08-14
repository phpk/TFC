(function($, doc) {
	$('ul').on('tap','li', function(){
		if(this.id) {
			$.openWindow({url : this.id, id : this.id})
		}
	});
}(mui, document));