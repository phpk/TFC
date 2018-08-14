(function($, doc) {
	$.init();
	//var currentkey = 'eth';
	
	var mycoin = wallet.getMyCoin();
	var len = 0;
	for(var p in mycoin) {
		len = len + 45;
		currentkey = p;
	}
	if(!currentkey) currentkey = 'eth';
	//console.log(currentkey);
	var coindata = wallet.getCoindata(currentkey);
	var myWallet = wallet.get(currentkey);
	doc.getElementById('list').innerHTML = template("tpl", {
		data: mycoin
	});
	
	//console.log(len)
	doc.getElementById('topPopover').style.height = len + 'px';

	function rendertpl() {
		doc.getElementById('coinname').innerHTML = coindata['name'];
		doc.getElementById('title').innerHTML = coindata['name'];
		//var addr = wallet.get(coindata['ctype']).address;
		//console.log(JSON.stringify(addr));
		wallet.getAmount(coindata, function(val) {
			doc.getElementById('leftmoney').value = wallet.num(val,8);
		});
		/*
		$.post(walletapi + 'getMoney', coindata, function(money) {
			doc.getElementById('leftmoney').value = money;
		});*/
	}
	rendertpl();
	$('#list').on('tap', 'li', function() {
		coindata = wallet.getCoindata(this.id);
		currentkey = coindata.address;
		myWallet = wallet.get(currentkey);
		rendertpl();
		doc.getElementById('title').innerHTML = coindata['name'];
		$('#topPopover').popover('hide');
	});
	doc.getElementById('allck').addEventListener('tap', function() {
		var to = doc.getElementById('pay_money');
		var left = doc.getElementById('leftmoney').value;
		//console.log(left);
		if(to.value != left) {
			to.value = left;
		} else {
			to.value = left;
		}
	})

	window.addEventListener('refreshdom', function(event) {
		doc.getElementById('pay_addr').value = event.detail.val;
	})
	doc.getElementById('sub').addEventListener('tap', function() {
		var pay_addr = doc.getElementById('pay_addr').value;
		var pay_money = doc.getElementById("pay_money").value;
		var passwd = doc.getElementById('jypassword').value;
		if(!pay_addr) {
			$.toast(lang("付款地址不能为空"));
			return;
		}
		if(pay_addr == myWallet.waddr) {
			$.alert(lang('不能自己给自己付款！'));
			return;
		}

		if(!pay_money) {
			$.toast(lang("付款金额不能为空"));
			return;
		}
		if(isNaN(pay_money)) {
			$.toast(lang("付款金额必须为数字"));
			return;
		}
		if(doc.getElementById('leftmoney').value * 1 < pay_money) {
			$.toast(lang("额度不足"));
			return;
		}
		if(!passwd || passwd == '' || passwd.length < 8 || md5(passwd) != myWallet.passwd) {
			$.toast(lang("钱包密码输入错误"));
			return;
		}
		wallet.send(pay_addr, pay_money, coindata, function() {
			$.alert(lang('付款成功'));
		}, function() {
			//$.alert(lang('付款失败'));
		});
	})
	doc.getElementById('qrscan').addEventListener('tap', function() {
		$.openWindow({
			url: 'weep.html',
			id: 'weep',
			extras: {
				frompage: 'pay.html'
			}
		});
	})
	function changeinptype() {
			//console.log(this.classList);
			if(this.classList.contains('gz-i-click')) {
				this.classList.remove('gz-i-click');
				doc.getElementById('jypassword').setAttribute('type', 'password');
			} else {
				this.classList.add('gz-i-click');
				doc.getElementById('jypassword').setAttribute('type', 'text');
			}

		}
		doc.getElementById('eyepassword').addEventListener('tap', changeinptype);

}(mui, document));