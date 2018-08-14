(function($, doc) {
	$.plusReady(function() {
		var imgpostarr = [];

		$('#sethtml').on('tap', 'li span', function() {

			jQuery(this).parent().remove();
		});
		// 点击提交
		document.getElementById('upload').addEventListener('tap', function() {
			postform();
		});

		// 选择图片或拍照并压缩
		document.getElementById('headImage').addEventListener('tap', function() {
			if(mui.os.plus) {
				var buttonTit = [{
					title: lang("拍照")
				}, {
					title: lang("从手机相册选择")
				}];

				plus.nativeUI.actionSheet({
					title: lang("上传图片"),
					cancel: lang("取消"),
					buttons: buttonTit
				}, function(b) { /*actionSheet 按钮点击事件*/
					switch(b.index) {
						case 0:
							break;
						case 1:
							getImage(); /*拍照*/
							break;
						case 2:
							galleryImg(); /*打开相册*/
							break;
						default:
							break;
					}
				})
			}
		}, false);

		// 拍照获取图片
		function getImage() {
			var c = plus.camera.getCamera();
			c.captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var imgSrc = entry.toLocalURL() + "?version=" + new Date().getTime(); //拿到图片路径

					setHtml(imgSrc);
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(s) {
				console.log("error" + s);
			}, {
				filename: "_doc/camera/"
			})
		}

		function setHtml(fileSrc) {
			var imgdata = mui(".task-img");
			if(imgdata.length < 5) {
				var li_1 = jQuery("<li><img  class='task-img' src='" + fileSrc + " '> <span>x</span></li>");
				jQuery("#sethtml").prepend(li_1);

			} else {
				mui.toast(lang('最多上传五张图片哦'));
			}

		}
		// 从相册中选择图片 
		function galleryImg() {
			// 从相册中选择图片
			plus.gallery.pick(function(e) {
				for(var i in e.files) {

					var fileSrc = e.files[i];
					plus.nativeUI.showWaiting();
					upload(fileSrc);
				}
			}, function(e) {
				console.log("取消选择图片");
			}, {
				filter: "image",
				multiple: true,
				maximum: 5,
				system: false,
				onmaxed: function() {
					plus.nativeUI.alert(lang('最多只能选择5张图片'));
				}
			});
		}

		function postform() {
			var content = jQuery('#content').val();
			var contact = jQuery('#contact').val();

			if(content.length < 6) {
				mui.toast(lang('问题描述不能为空或少于6位'));
				return;
			}
			if(contact.length < 6) {
				mui.toast(lang('联系方式不能少于6位'));
				return;
			}
			
			var postdata = {
				is_lang: postlang,
				content: content,
				contact: contact,
				img_url: imgpostarr.join(',')
			};
			plus.nativeUI.showWaiting();
			$.post(apiurl + 'member/suggest', postdata, function(res) {
				var status = res.status;
				if(status > 0) {
					mui.toast(res.msg);
					mui.back();
				} else {
					mui.toast(lang('意见反馈失败'));

				}
				plus.nativeUI.closeWaiting();

			}, 'json');

		}

		// 上传的方法
		function upload(fileSrc) {

			createUp(fileSrc);

			function createUp(path) {

				plus.zip.compressImage({
					src: path,
					dst: "_doc/chat/gallery/" + path,
					quality: 20,
					overwrite: true
				}, function(e) {

					var task = plus.uploader.createUpload(apiurl + 'member/suggest_upload', {
							method: "POST"
						},
						function(t, status) { //上传完成
							if(status == 200) {
								console.log("上传成功：" + t.responseText);

								var imgurl = JSON.parse(t.responseText)
								var li_1 = jQuery("<li><img  class='task-img' src='" + imgurl.data + " '> <span>x</span></li>");
								jQuery("#sethtml").prepend(li_1);
								imgpostarr.push(imgurl.data);
								plus.nativeUI.closeWaiting();

							} else {
								console.log("上传失败：" + status);
							}

						}
					);
					//添加其他参数
					console.log(JSON.stringify(e));

					var imgdata = mui(".task-img");
					if(imgdata.length < 5) {
						task.addFile(e.target, {
							key: 'img_url'
						});
						task.addData("is_lang", '1');
						task.start();

					} else {
						mui.toast(lang('最多上传五张图片哦'));
						plus.nativeUI.closeWaiting();
					}

				}, function(err) {
					console.error("压缩失败：" + err.message);
				});

			}
		}

	});

}(mui, document));