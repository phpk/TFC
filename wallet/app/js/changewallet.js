(function($, doc) {
	var ethWallet = wallet.get('eth');
	var btcWallet = wallet.get('btc');
	var eosWallet = wallet.get('eos');

	doc.getElementById('etharea').innerHTML = template("wallet-template", {
		data: ethWallet['list'],
		def: ethWallet.address,
		etype: 'eth'
	});

	doc.getElementById('btcarea').innerHTML = template("wallet-template", {
		data: btcWallet['list'],
		def: btcWallet.address,
		etype: 'btc'
	});
	doc.getElementById('eosarea').innerHTML = template("wallet-template", {
		data: eosWallet['list'],
		def: eosWallet.address,
		etype: 'eos'
	});
	//langInit();
	$(".gz-all-tab").on('tap', 'span', function() {
		//console.log(this.id);
		var current = $('.gz-all-tab-checked')[0];
		var currentid = current.id;
		current.classList.remove('gz-all-tab-checked');
		doc.getElementById(currentid + 'area').style.display = 'none';
		this.classList.add('gz-all-tab-checked');
		doc.getElementById(this.id + 'area').style.display = '';
	});
	$.plusReady(function() {
		$('.gz-qb-list').on('tap', '.gz-mui-radio', function() {
			var etype = this.parentNode.getAttribute('data-etype');
			var address = this.parentNode.getAttribute('data-id');
			//var obj = res[etype][address];
			var el = doc.getElementById(address);
			if(el.checked) {
				//console.log(el.checked);
				//el.setAttribute('checked', true);
				return;
			}
			if(etype == 'eth') {
				var datawallet = ethWallet;
			} else if(etype == 'btc') {
				var datawallet = btcWallet;
			} else if(etype == 'eos') {
				var datawallet = eosWallet;
			}
			//console.log(JSON.stringify(wallet));
			var list = datawallet['list'];
			var res = list[address];
			for(var p in res) {
				datawallet[p] = res[p];
			}
			//console.log(JSON.stringify(wallet));
			//return;
			wallet.set(datawallet, etype);
			var mainWin = plus.webview.getWebviewById('wallet.html');
			$.fire(mainWin, 'flashWallet', null);
			$.toast(lang('设置成功！'));
		});
	})

	$('.gz-qb-list').on('tap', '.gz-qb-text', function() {
		//var etype = this.parentNode.getAttribute('data-etype');
		var addr = this.parentNode.getAttribute('data-id');
		//console.log(addr);
		var clipboard = new Clipboard('.gz-qb-list', {
			// 通过target指定要复印的节点
			text: function() {
				//console.log(addr);
				return addr;
			}
		});
		clipboard.on('success', function(e) {
			console.log(JSON.stringify(e));
			mui.toast(lang("已复制钱包地址"));
		});
	});
	$('.gz-qb-list').on('tap', '.gz-qb-but', function() {
		var etype = this.parentNode.getAttribute('data-etype');
		var addr = this.parentNode.getAttribute('data-id');
		var name = this.parentNode.getAttribute('data-name');
		doc.getElementById('pop').style.display = '';
		doc.getElementById('wname').value = name;
		doc.getElementById('etype').value = etype;
		doc.getElementById('addr').value = addr;

	});
	doc.getElementById('close1').addEventListener('tap', function() {
		doc.getElementById('pop').style.display = 'none';
	})
	doc.getElementById('btn').addEventListener('tap', function() {
		var wname = doc.getElementById('wname').value;
		var etype = doc.getElementById('etype').value;
		var addr = doc.getElementById('addr').value;
		if(!wname || wname == '') {
			$.toast(lang('名称不能为空'));
			return;
		}
		if(!etype || !addr) {
			$.toast(lang('参数错误！'));
			return;
		}
		wallet.edit('name', wname, addr, etype);
		doc.getElementById('pop').style.display = 'none';
		doc.getElementById(addr + 'name').innerHTML = wname;
		doc.getElementById('wname').value = wname;
		var el = doc.getElementById(addr).parentNode.parentNode.parentNode;
		el.setAttribute('data-name', wname);
		$.toast(lang('修改成功！'));
	})

}(mui, document));