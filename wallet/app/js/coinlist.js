(function($, doc) {
	$.init();
	var datalist = wallet.getlist();
	var mylist = wallet.getMyCoin();
	var maindata = {};
	var ethdata = {};
	var btcdata = {};
	// console.log(JSON.stringify(mylist));
	for(var p in datalist) {
		var val = datalist[p];
		if(mylist && p in mylist) {
			val['selected'] = 1;
		} else {
			val['selected'] = 0;
		}

		if(val['ctype'].indexOf('contact') === -1) {
			maindata[p] = val;
		} else {
			if(val['ctype'] == 'btccontact') {
				btcdata[p] = val;
			}
			if(val['ctype'] == 'ethcontact') {
				ethdata[p] = val;
			}
		}
	}
	
	getDataList(maindata,ethdata,btcdata);

	$(".gz-all-tab").on('tap', 'span', function() {
		// console.log(this.id);
		getDataList(maindata,ethdata,btcdata);
		doc.getElementById('select').value = '';
		var current = $('.gz-all-tab-checked')[0];
		var currentid = current.id;
		current.classList.remove('gz-all-tab-checked');
		doc.getElementById(currentid + 'area').style.display = 'none';
		this.classList.add('gz-all-tab-checked');
		doc.getElementById(this.id + 'area').style.display = '';
	});
	$.plusReady(function() {
		$('.gz-qianbao-list').on('tap', '.mui-switch', function() {
		if(this.classList.contains('mui-active')) {
			this.classList.remove('mui-active');
		}else{
			this.classList.add('mui-active');
		}
		var id = this.id;
		//console.log(id);
		wallet.editMyCoin(id);
		var mainWin = plus.webview.getWebviewById('wallet.html');
		$.fire(mainWin, 'flashWallet', null);
		
	});
	})
	

	function selectvar(searchString, arr) {
		var articles_array = {};
		if(!searchString) {
			return arr;
		}
		var has = false;
		for(var v in arr) {
			searchString = searchString.trim().toLowerCase();
			var selItem = arr[v];
			if(selItem.coinname.toLowerCase().indexOf(searchString) !== -1) {
				articles_array[v] = selItem;
				has = true;
			}
		}
		if(!has) {
			return arr;
		}
		return articles_array;
	}
	function getDataList(maindata_g,ethdata_g,btcdata_g){
		doc.getElementById('mainarea').innerHTML = template("tpl", {
			data: maindata_g
		});

		doc.getElementById('etharea').innerHTML = template("tpl", {
			data: ethdata_g
		});
		doc.getElementById('btcarea').innerHTML = template("tpl", {
			data: btcdata_g
		});
		
		
	}
	
	doc.getElementById('selectbut').addEventListener('tap', function() {
		var selectval = doc.getElementById('select').value;
		let maindata_s = selectvar(selectval, maindata);
		let ethdata_s = selectvar(selectval, ethdata);
		let btcdata_s = selectvar(selectval, btcdata);
		getDataList(maindata_s,ethdata_s,btcdata_s);
	});

}(mui, document));