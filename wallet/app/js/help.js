(function($, doc) {
	$.plusReady(function() {
		$.post(apiurl + 'news/helpList', {
			is_lang: postlang
		}, function(data) {
			helplist(data.data);
		}, 'json');

		$('ul').on('tap', 'li', function() {

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