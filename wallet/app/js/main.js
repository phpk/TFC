mui.plusReady(function() {
	var subStyle = {
		top: '45px',
		bottom: '60px'
	};
	mui.init({
		swipeBack: false
	});
	//localStorage.setItem('hasbackup', 1);
	var self = plus.webview.currentWebview();
	sub = plus.webview.create("wallet.html", "wallet.html", subStyle);
	self.append(sub);
	function switchpage(_event, targetTab) {
		var activeTab = localStorage.getItem('defaultTab');
		var activeObj = document.getElementById(activeTab);
		var targetObj = document.getElementById(targetTab);
		plus.webview.hide(activeTab);
		//显示目标选项卡
		
		if(!plus.webview.getWebviewById(targetTab)) {
			var sub = plus.webview.create(targetTab, targetTab, subStyle);
			// append到当前父webview
			self.append(sub);
		} else {
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//console.log(targetTab);
		document.getElementById('title').innerHTML = document.getElementById('label' + targetTab).innerHTML;

		// 底部选项
		activeObj.classList.remove("gz-tab-checked");
		targetObj.classList.add("gz-tab-checked");


		localStorage.setItem('defaultTab', targetTab);

	}
	localStorage.setItem('defaultTab', 'wallet.html');
	mui('.gz-tab-list-box').on('tap', 'div', function(e) {
		var targetTab = this.getAttribute('id');
		var activeTab = localStorage.getItem('defaultTab');
		if(targetTab != activeTab) {
			switchpage("tap", targetTab);
		}

	});
})