(function($, com) {
	com.getdata = function(){
		var data = localStorage.getItem('coinprice');
		if(data){
			return JSON.parse(data);
		}else{
			return false;
		}
	}
	com.now = function() {
		//获取js 时间戳
		var time = new Date().getTime();
		//去掉 js 时间戳后三位，与php 时间戳保持一致
		return parseInt(time / 1000);
	}
	com.gettime = function(){
		return localStorage.getItem('coinprice-time');
	}
	com.get = function(func){
		var data = com.getdata();
		var ctime = com.gettime();
		var now = com.now();
		if(!data || !ctime || ctime < now){
			return com.initdata(func);
		}else{
			return func(data);
		}
	}
	com.initdata = function(func){
		$.getJSON('https://api.coinmarketcap.com/v2/ticker/', function(res){
			var list = res.data;
			var rt = {};
			for(var p in list){
				var item = list[p];
				rt[item['symbol']] = item['quotes']['USD']['price'];
			}
			localStorage.setItem('coinprice', JSON.stringify(rt));
			localStorage.setItem('coinprice-time', com.now() + 1800);
			func(rt);
		});
	}
	com.getOne = function(name,func){
		com.get(function(rt){
			if(rt[name]){
				func(rt[name]);
			}else{
				func(0);
			}
		});
	}
	com.getList = function(names, func){
		com.get(function(rt){
			//console.log(JSON.stringify(rt));
			var res = {};
			//var str = names.split(',');
			for(var p in names) {
				var name = names[p];
				
				if(name) {
					if(rt[name]){
						res[name] = rt[name];
					}else{
						if(name == 'EOS(eth)'){
							res[name] = rt['EOS'];
						}else{
							res[name] = 0;
						}
					}
					
				}else{
					res[name] = 0;
				}
			}
			//console.log(JSON.stringify(res));
			func(res);
		});
	}
}(mui, window.coinprice = {}));