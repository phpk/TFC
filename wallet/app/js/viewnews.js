(function($, doc) {
	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		var id = self.nid;
		$.post(apiurl + 'news/newsDetail', {
			is_lang: postlang,
			id: parseInt(id)
		}, function(data) {
			if(data.status > 0) {
				document.getElementById("title").innerHTML = data.data.title;
				document.getElementById("nfrom").innerHTML = data.data.nfrom;
				document.getElementById("content").innerHTML = data.data.content;
				document.getElementById("addtime").innerHTML = data.data.addtime;
			} else {
				$.toast(lang('新闻拉取失败'));
				$.back();
			}

		}, 'json');
	});

}(mui, document));