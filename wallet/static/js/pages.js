(function() {
	

	var template = '<div class="loading" style="color:#777;font-weight:700;font-size:15px;text-align:center;line-height:60px;">' +
		'<span><span class="mui-spinner" style="margin:-4px 4px;vertical-align:middle;"></span><span class="">Loading...</span></span>' +
		'<span style="display:none;">No More</span>' +
		'</div>';

	function insertHtml(dom, html, refChild) {

		var div = document.createElement('div');
		var node;

		div.innerHTML = html;

		while(node = div.firstChild) {
			if(refChild) {
				dom.insertBefore(node, refChild);
			} else {
				dom.appendChild(node);
			}
		}

		div.innerHTML = '';
	}

	function closeLoading(dom) {

		dom = dom.firstChild;
		dom.style.display = 'none';

		dom = dom.nextSibling;
		dom.style.display = '';
	}

	function lazyUp(container, dom, options) {

		var loadData = options.loadData,
			loadPage = options.loadPage || loadData,
			pageSize = options.pageSize || 20,
			page = 1,
			loading;

		function touchend() {

			if(loading || this.scrollTop < 50) {
				return;
			}

			loading = true;

			loadPage(page + 1, pageSize, function(html, records) {

				loading = false;
				insertHtml(dom, html);

				if(records < pageSize) {
					closeLoading(dom.firstChild);
					container.onscroll = null;
				} else {
					page++;
				}
			});
		}

		loadData(1, pageSize, function(html, records) {

			dom.innerHTML = template + html;

			if(records < pageSize) {
				closeLoading(dom.firstChild);
				container.onscroll = null;
			} else {
				container.onscroll = touchend;
			}
		});
	}

	function lazyDown(container, dom, options) {

		var loadData = options.loadData,
			loadPage = options.loadPage || loadData,
			pageSize = options.pageSize || 20,
			page = 1,
			loading;

		function touchend() {

			if(loading || this.scrollTop + 100 < this.scrollHeight - this.offsetHeight) {
				return true;
			}

			loading = true;

			loadPage(page + 1, pageSize, function(html, records) {

				loading = false;
				insertHtml(dom, html, dom.lastChild);

				if(records < pageSize) {
					closeLoading(dom.lastChild);
					container.onscroll = null;
				} else {
					page++;
				}
			});
		}

		loadData(1, pageSize, function(html, records) {

			dom.innerHTML = html + template;

			if(records < pageSize) {
				closeLoading(dom.lastChild);
				container.onscroll = null;
			} else {
				// container.ontouchend = touchend;
				container.onscroll = touchend;
			}
		});
	}

	mui.lazyload = function(dom, options) {

		var container;

		if(typeof dom === 'string') {
			dom = document.querySelector(dom);
		}

		if(options) {
			if(container = options.container) {
				if(typeof container === 'string') {
					container = document.querySelector(container);
				}
			} else {
				container = dom;
			}

			container.style.overflowY = 'auto';
			dom.innerHTML = template;

			if(options.up) {
				lazyUp(container, dom, options);
			} else {
				lazyDown(container, dom, options);
			}
		}
	}

	mui.lazyloadEnd = function(dom, html, up) {

		if(typeof dom === 'string') {
			dom = document.querySelector(dom);
		}

		if(up) {
			dom.innerHTML = template + (html || '');
			closeLoading(dom.firstChild);
		} else {
			dom.innerHTML = (html || '') + template;
			closeLoading(dom.lastChild);
		}
	}

})();