(function($, doc) {
	$.init();
	//var currentkey = 'eth';
	
	var mycoin = wallet.getMyCoin();
	var len = 0;
	for(var p in mycoin){
		len = len + 45;
		currentkey = p;
	}
	if(!currentkey) currentkey = 'eth';
	var myWallet = wallet.get(currentkey);
	var address = myWallet.address;
	var coindata = wallet.getmyCoindata(currentkey);
	doc.getElementById('list').innerHTML = template("tpl", {
		data: mycoin
	});
	
	doc.getElementById('topPopover').style.height = len + 'px';
	$('#list').on('tap','li', function(){
		coindata = wallet.getmyCoindata(this.id);
		var ctype = coindata.ctype;
		currentkey = this.id;
		myWallet = wallet.get(this.id);
		address = myWallet.address;
		rendertpl(address);
		doc.getElementById('title').innerHTML = coindata['name'];
		/*
		if(ctype == 'eth' || ctype == 'ethcontact'){
			doc.getElementById('out').style.display = '';
		}else{
			doc.getElementById('out').style.display = 'none';
		}*/
		$('#topPopover').popover('hide');
	});
	function rendertpl(addr){
		doc.getElementById('qr').innerHTML = '';
		//var myWallet = wallet.get(type);
		var qrcode = new QRCode('qr', {
			text: myWallet.address,
			width: 250,
			height: 250,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});
		doc.getElementById('addr').innerHTML = myWallet.address;
		doc.getElementById('title').innerHTML = coindata['name'];
		console.log(coindata['name'])
	}
	rendertpl(address);
	var clipboard = new Clipboard('.gz-payment-copy', {
		// 通过target指定要复印的节点
		text: function() {
			return document.querySelector('#addr').innerText;
		}
	});
	clipboard.on('success', function(e) {
		console.log(JSON.stringify(e));
		mui.toast(lang("已复制钱包地址"));
	});
	/*
	doc.getElementById('imtoken').addEventListener('tap', function(){
		//rendertpl('iban:' + address);
		rendertpl(address);
	})
	doc.getElementById('metamask').addEventListener('tap', function(){
		//rendertpl('ethereum:' + address);
		rendertpl(address);
	})
	doc.getElementById('me').addEventListener('tap', function(){
		rendertpl(address);
	})*/
	var baseImgFile = function(uid, base64, quality, callback) {
		quality = quality || 10;
		callback = callback || $.noop;
		var bitmap = new plus.nativeObj.Bitmap();
		// 从本地加载Bitmap图片 
		bitmap.loadBase64Data(base64, function() {
			//    console.log('加载图片成功'); 
			bitmap.save("_doc/" + uid + ".jpg", {
				overwrite: true,
				quality: quality
			}, function(i) {
				callback(i);
				console.log(lang('保存图片成功：')+JSON.stringify(i)); 
			}, function(e) {
				console.log(lang('保存图片失败：') + JSON.stringify(e));
			});
		}, function(e) {
			console.log(lang('加载图片失败：') + JSON.stringify(e));
		});
	}
	mui.plusReady(function() {
		//点击保存二维码
		document.getElementById('save_qrcode').addEventListener('tap', function() {
			var path = document.querySelector('#qr img').src;
			//转成jpg格式存到本地
			baseImgFile('sk_qrcode_' + address, path, 100, function(i) {
				//alert(JSON.stringify(i)); 
				console.log(JSON.stringify(i));
			});

			var new_path = "_doc/" + 'sk_qrcode_' + address + ".jpg";
			plus.gallery.save(new_path, function() {
				mui.toast(lang('保存图片成功！'));
			}, function() {
				mui.toast(lang('保存失败'));
			});
		}, false);
	

	})
}(mui, document));