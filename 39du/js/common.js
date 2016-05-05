(function ($) {
	// 返回顶部
	$.fn.goTop = function (opt) {
		var _this= this;
		this.click(function () {
			$('html,body').animate({
					scrollTop: 0 
				}, 200);
		});
		$(window).on('scroll', function () {
			var scrollTop = $(document).scrollTop();
			var maxScrollTop = $(document.body).height() - $(window).height()+80;
			if(scrollTop > 0) {
				_this.show();
			} 
			else {
				_this.hide();
			}
			if(scrollTop == maxScrollTop) {
				_this.css('opacity', 1);
			} else {
				_this.css('opacity', 0.5);
			}
		});
		this.on('mouseover' ,function () {
			_this.css('opacity', 1);
		})
		this.on('mouseout' ,function () {
			var scrollTop = $(document).scrollTop();
			var maxScrollTop = $(document.body).height() - $(window).height()+80;
			if(scrollTop !== maxScrollTop){
				_this.css('opacity', 0.5);
			}
		})
	}

	// 下载App
	$.fn.downLoad = function () {
		var option = {
			url: '../images/common/download.png',
			width: 250,
			height: 250
		}
		var control = false;
		var $layer = $('<div class="layer"></div>').appendTo('body');
		var $image = $('<img class="down-load-img" src="' + option.url + '">').css({
			marginLeft: option.width * -1/2 + 'px',
			marginTop: option.height * -1/2 + 'px'
		}).appendTo('body');
		
		this.on('mouseover', function() {
			if (control) {
				return;
			}
			$layer.show().animate({
				opacity:0.4
			});
			$image.show().animate({
				opacity:1
			})
		});
		this.on('mouseout', function () {
			if (control) {
				return;
			}
			control = true;
			$layer.animate({
				opacity:0
			},function () {
				$(this).hide();
			});
			$image.animate({
				opacity:0
			},function () {
				control = false;
				$(this).hide();
			});
		});
	}

})(jQuery);
$('.go-top').goTop();
$('#down-load-btn').downLoad();