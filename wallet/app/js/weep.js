(function($, doc) {
	$.plusReady(function() {
		var scan;
		mui.init();
		var self = plus.webview.currentWebview();
		var frompage = self.frompage;
		//var fromelid = self.fromelid;
		var styles = {
			frameColor: "#29E52C",
			scanbarColor: "#29E52C",
			background: ""
		};
		setTimeout(function() {
			scan = new plus.barcode.Barcode('bcid', styles);
			//scan.close();
			scan.onmarked = onmarked;
			scan.start();
		}, 1000);

		function onmarked(type, result) {
			var text = lang('未知: ');
			switch(type) {
				case plus.barcode.QR:
					text = 'QR: ';
					break;
				case plus.barcode.EAN13:
					text = 'EAN13: ';
					break;
				case plus.barcode.EAN8:
					text = 'EAN8: ';
					break;
			}
			console.log(result);
			//alert(text + result);
			//scan.close();
			parseQrcode(result);
		}

		function parseQrcode(result) {
			var player = document.createElement('audio');
			player.src = '../static/images/di.mp3';
			player.volume = 1;
			player.loop = false;
			player.play();
			//scan.close();
			self.close();
			var fromwin = plus.webview.getWebviewById(frompage)
			//console.log(JSON.stringify(fromwin));
			console.log(result);
			if(result.indexOf(":") !== -1) {
				var str = result.split(":");
				result = str[1];
				if(result.indexOf("?") !== -1){
					var str = result.split("?");
					result = str[0];
				}
				
			}
			mui.fire(fromwin, 'refreshdom', {
				val: result
			});
			
		}

		function tocoin(str, type) {
			closeScan();
		}

		function cancelScan() {
			scan.cancel();
		}

		function onPlusReady() {}

		function startRecognize() {
			scan = new plus.barcode.Barcode('bcid');
			scan.onmarked = onmarked;
		}

		function startScan() {
			scan.start();
		}

		function closeScan() {
			scan.cancel();
			scan.close();
		}

		$.back = function(event) {
			closeScan();
			plus.webview.currentWebview().close();
			return false;
		};
	});

}(mui, document));