(function($, doc) {
	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		var id = self.nid;
		$.post(apiurl + 'news/helpDetail', {
			is_lang: postlang,
			id: parseInt(id)
		}, function(data) {
			document.getElementById("title").innerHTML = data.data.title;
			document.getElementById("article").innerHTML = data.data.content;
		}, 'json');
	});

}(mui, document));