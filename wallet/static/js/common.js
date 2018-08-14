(function($, com) {

	/**
	 * @description 产生一个随机数
	 */
	com.getUid = function() {
		//return guid();
		return Math.floor(Math.random() * 100000000 + 10000000).toString();
	};

	com.createState = function(info) {
		//var state = com.getState();
		//state.account = info.account;
		//state.user_id = info.user_id;
		//state.passwd = info.passwd;
		/*
		if(info['avatar']) {
			info['avatar'] = serverurl + info['avatar'];
		}*/
		var state = info;

		state.token = com.token();
		com.setState(state);
		//setContact(info.user_id);
		return state;
	};
	/**
	 * 获取当前状态
	 **/
	com.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		var rt = JSON.parse(stateText);
		//ckContact(rt.user_id);
		return rt;
	};
	/**
	 * 设置当前状态
	 **/
	com.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};
	/**
	 * 获取应用本地配置
	 **/
	com.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	};
	/**
	 * 数组排序
	 * @param {Object} arr
	 * @param {Object} key
	 */
	com.arrSort = function(arr, key) {
		for(var j = 0; j < arr.length - 1; j++) {
			//两两比较，如果前一个比后一个大，则交换位置。
			for(var i = 0; i < arr.length - 1 - j; i++) {
				if(arr[i][key] < arr[i + 1][key]) {
					var temp = arr[i];
					arr[i] = arr[i + 1];
					arr[i + 1] = temp;
				}
			}
		}
		return arr;
	};

	/**
	 * 设置应用本地配置
	 **/
	com.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	};

	com.out = function() {
		localStorage.removeItem('$token');
		var state = com.getState();
		state.islast = 1;
		com.setUsers(state);
		localStorage.removeItem('$state');
	}
	com.now = function() {
		//获取js 时间戳
		var time = new Date().getTime();
		//去掉 js 时间戳后三位，与php 时间戳保持一致
		return parseInt(time / 1000);
	}
	/**
	 * 毫秒转换友好的显示格式
	 * 输出格式：21小时前
	 * @param  {[type]} time [description]
	 * @return {[type]}      [description]
	 */
	com.dateStr = function(date) {
		//获取js 时间戳
		var time = new Date().getTime();
		//去掉 js 时间戳后三位，与php 时间戳保持一致
		time = parseInt((time - date * 1000) / 1000);

		//存储转换值 
		var s;
		var date = new Date(parseInt(date) * 1000);
		var hours = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		if(time < 60 * 10) { //十分钟内
			return '刚刚';
		} else if((time < 60 * 60) && (time >= 60 * 10)) {
			//超过十分钟少于1小时
			s = Math.floor(time / 60);
			return s + "分钟前";
		} else if((time < 60 * 60 * 24) && (time >= 60 * 60)) {
			//超过1小时少于24小时
			s = Math.floor(time / 60 / 60);
			return s + "小时前";
		} else if((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
			//超过1天少于3天内
			s = Math.floor(time / 60 / 60 / 24);
			return s + "天前" + ' ' + hours;
		} else {
			//超过3天
			return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' ' + hours;
		}
	}

	/**
	 * @author liuyf 2015-4-30
	 * @description 获取系统信息
	 */
	com.GetDeviceInfo = function() {
		var device = {
			IMEI: plus.device.imei,
			IMSI: '',
			Model: plus.device.model,
			Vendor: plus.device.vendor,
			UUID: plus.device.uuid,
			Screen: plus.screen.resolutionWidth * plus.screen.scale + 'x' + plus.screen.resolutionHeight * plus.screen.scale + '',
			DPI: plus.screen.dpiX + 'x' + plus.screen.dpiY,
			OS: new Object()
		};
		for(var i = 0; i < plus.device.imsi.length; i++) {
			device.IMSI += plus.device.imsi[i];
		}
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = '未知网络';
		types[plus.networkinfo.CONNECTION_NONE] = '未连接网络';
		types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络';
		types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络';
		types[plus.networkinfo.CONNECTION_CELL2G] = '2G蜂窝网络';
		types[plus.networkinfo.CONNECTION_CELL3G] = '3G蜂窝网络';
		types[plus.networkinfo.CONNECTION_CELL4G] = '4G蜂窝网络';
		device.NetworkInfo = types[plus.networkinfo.getCurrentType()];
		device.OS = {
			Language: plus.os.language,
			Version: plus.os.version,
			Name: plus.os.name,
			Vendor: plus.os.vendor
		};
		return device;
	};

	/**
	 * @description 双击返回键退出
	 */
	com.bindQuit = function() {
		if(mui.os.android) {
			var backButtonPress = 0;
			mui.back = function(event) {
				backButtonPress++;
				if(backButtonPress > 1) {
					plus.runtime.quit();
				} else {
					plus.nativeUI.toast('再按一次退出应用');
				}
				setTimeout(function() {
					backButtonPress = 0;
				}, 1000);
				return false;
			};
		}
	};
	com.call = function(number) {
		if(plus.os.name == "Android") {
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var main = plus.android.runtimeMainActivity();
			var uri = Uri.parse("tel:" + number);
			var call = new Intent("android.intent.action.CALL", uri);
			main.startActivity(call);
		} else {
			//plus.device.dial(number, false); 
			var UIAPP = plus.ios.importClass("UIApplication");
			var NSURL = plus.ios.importClass("NSURL");

			var app = UIAPP.sharedApplication();

			app.openURL(NSURL.URLWithString("tel://" + number));
		}
	};

	com.sms = function(number, text) {
		if(plus.os.name == "Android") {
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var uri = Uri.parse("smsto:" + number);
			var intent = new Intent(Intent.ACTION_SENDTO, uri);
			intent.putExtra("sms_body", "");

			plus.android.runtimeMainActivity().startActivity(intent);
		} else {
			var UIAPP = plus.ios.importClass("UIApplication");
			var NSURL = plus.ios.importClass("NSURL");
			var app = UIAPP.sharedApplication();
			app.openURL(NSURL.URLWithString("sms://" + number));
		}
	};
	com.androidMarket = function(pname) {
		plus.runtime.openURL("market://details?id=" + pname);
	};

	com.iosAppstore = function(url) {
		plus.runtime.openURL("itms-apps://" + url);
	};
	com.substr = function(str, n) {
		var r = /[^\x00-\xff]/g;
		if(str.replace(r, "mm").length <= n) {
			return str;
		}
		var m = Math.floor(n / 2);
		for(var i = m; i < str.length; i++) {
			if(str.substr(0, i).replace(r, "mm").length >= n) {
				return str.substr(0, i) + "...";
			}
		}
		return str;
	}
	com.HTMLDecode = function(text) {
		var temp = document.createElement("div");
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	}

}(mui, window.app = {}));
//(function($, lang, langData) {
var langData = langData || {};
var defaultLan = localStorage.getItem('defaultLan') || 'zh';
var postlang = 1;
switch(defaultLan) {
	case 'zh':
		postlang = 1
		break;
	case 'tw':
		postlang = 2
		break;
	case 'en':
		postlang = 3
		break;
}
//翻译完注释掉
//var defaultLan = 'en';
function lang(txt) {
	if(langData[defaultLan] && langData[defaultLan][txt]) {
		return langData[defaultLan][txt];
	}
	return txt;
}
//console.log(JSON.stringify(defaultLan));
function langInit() {
	var
		el = document.querySelectorAll('[lang]'),
		//el = document.querySelectorAll('*'),
		len = el.length,
		i = 0;
	//console.log(JSON.stringify(el));
	if(len > 0) {
		for(; i < len; i++) {
			var obj = el[i],
				inner = obj.innerText,
				//title = obj.getAttribute('title'),
				placeholder = obj.getAttribute('placeholder'),
				//titleLang = langData[defaultLan][title],
				placeholderLang = langData[defaultLan][placeholder],
				innerLang = langData[defaultLan][inner];
			//console.log(obj);
			if(inner && innerLang) {
				obj.innerText = innerLang;
			}
			/*
			if(title && titleLang) {
				obj.setAttribute('title', titleLang);
			}*/
			if(placeholder && placeholderLang) {
				obj.setAttribute('placeholder', placeholderLang);
			}

		}
	}
}
mui.plusReady(function() {
	if(defaultLan && langData[defaultLan]) {
		langInit();
	}
});
//}(mui, window.lang, window.langData));