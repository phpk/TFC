(function($, doc) {
	$.init();
	$.post(apiurl + 'news/newsAdv', {
		is_lang: postlang
	}, function(data) {
		//console.log(JSON.stringify(data));
		var data = data.data;
		var len = data.length;
		//console.log(JSON.stringify(data[len - 1]));
		//console.log(JSON.stringify(data[0]));
		if(len > 1) {
			//return;
			var tlen = len - 1;
			doc.getElementById('slider').innerHTML = template('newsadv-template', {
				data: data,
				first: data[tlen],
				end: data[0],
				len: tlen
			});
			var slider = mui("#slider");
			slider.slider({
				interval: 5000
			});

		}

	}, 'json');

	$('#newslist').on('tap', 'li', function() {

		$.openWindow({
			url: 'viewnews.html',
			id: 'viewnews',
			extras: {
				nid: this.id
			},
		})
	});

	function refresh() {
		$.lazyload('#newslist', {
			loadData: getRecord,
			container: '.gz-news-box'
		});
	}

	function getRecord(page, size, callback) {
		var postdata = {
			is_lang: postlang,
			page: page,
			size: size
		};
		var url = apiurl + 'news/newsList';
		console.log(JSON.stringify(postdata));
		$.post(url, postdata, function(res) {
			var list = res.data;
			console.log(JSON.stringify(list));
			if(list && list.length > 0) {
				callback(template("newslist-template", {
					newslist: list
				}), list.length);
			} else {
				callback('', 0);
			}
		}, 'json');
	}
	$.lazyload('#newslist', {
		loadData: getRecord,
		container: '.gz-news-box'
	});

}(mui, document));