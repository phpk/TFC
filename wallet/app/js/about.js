(function($, doc) {
	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		var id = self.nid;
		$.post(apiurl + 'news/aboutUs', {
			is_lang: postlang
		}, function(data) {
			document.getElementById("article").innerHTML = data.data;
		}, 'json');
	});

}(mui, document));