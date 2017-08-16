$(function () {
	var $leftNav = $('.left-nav');
	var leftNavTop = $leftNav.offset().top - 80;

	$(window).on('scroll', function () {
		if($(document).scrollTop() > leftNavTop) {
			$leftNav.addClass('left-nav-fixed');
			$leftNav.css('top', 60);
		} else {
			$leftNav.removeClass('left-nav-fixed');
		}
	});

	var page = function () {

		// 缓存高度
		var cache = {},
			top = 0,
			scrollTop = 0;
		function active(key) {
			$('.left-nav li').removeClass('active');
			$('.left-nav li[data-key="'+key+'"]').addClass('active');
		}
		return {
			scrollTo: function (key) {
				active(key);
				if(cache[key]) {
					scrollTop = cache[key];
				}
				else {
					top = $('.main-content h2[data-key="'+key+'"]').offset().top;
					scrollTop = top - 80;
					cache[key] = scrollTop;
				}
				
				$('html,body').animate({
					scrollTop:scrollTop 
				}, 400);
			}
		}
	}();


	$leftNav.on('click', 'li', function () {
		var key = $(this).data('key');
		page.scrollTo(key);
	})
});

