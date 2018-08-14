(function($, doc) {
	$('#faqhelp').on('tap','li', function(){
		if(this.id) {
			$.openWindow({url : this.id, id : this.id})
		}
	});
	$.plusReady(function() {
		$.post(apiurl + 'news/helpList', {
			is_lang: postlang
		}, function(data) {
			helplist(data.data);
		}, 'json');

		$('#help-list').on('tap', 'li', function() {

			$.openWindow({
				url: 'viewhelp.html',
				id: 'viewhelp',
				extras: {
					nid: this.id
				},
			})
		});

		function helplist(data) {
			doc.getElementById('help-list').innerHTML = template('help-template', {
				data: data
			});
		}
	});
}(mui, document));