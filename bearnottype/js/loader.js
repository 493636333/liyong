(function ($) {

	// 要预加载的图片
	var imgs = {
		pre: '/app/images',
		list: {
			common: [
				'active.png',
				'again.png',
				'again-active.png',
				'bg.jpg',
				'continue.png',
				'continue-active.png',
				'logo.png',
				'product.png',
				'question-bg.png',
				'retry.png',
				'retry-active.png',
				'share.png',
				'share-active.png',
				'share-bg.png',
				'shuzhi.png',
				'voice-pause.png',
				'voice-play.png',
				'yezi.png',
				'answer.png',
				'bgmusic.mp3',
				'click.WAV'
			],
			page1: [
				'back.png',
				'beiye-1.png',
				'beiye-2.png',
				'btn-click-after.png',
				'btn-click-before.png',
				'name.png',
				'ruocai.png'
			],
			page2: [
				'a.png',
				'a+.png',
				'b.png',
				'b+.png',
				'c.png',
				'c+.png',
				'a++.gif',
				'b++.gif',
				'c++.gif',
				'question.png'
			],
			page3: [
				'a.png',
				'a+.png',
				'b.png',
				'b+.png',
				'c.png',
				'c+.png',
				'a++.gif',
				'b++.gif',
				'c++.gif',
				'question.png'
			],
			page4: [
				'a.png',
				'a+.png',
				'b.png',
				'b+.png',
				'c.png',
				'c+.png',
				'a++.gif',
				'b++.gif',
				'c++.gif',
				'question.png'
			],
			page5: [
				'a.png',
				'a+.png',
				'b.png',
				'b+.png',
				'c.png',
				'c+.png',
				'a++.gif',
				'b++.gif',
				'c++.gif',
				'question.png'
			],
			page6: [
				'a.png',
				'a+.png',
				'b.png',
				'b+.png',
				'c.png',
				'c+.png',
				'a++.gif',
				'b++.gif',
				'c++.gif',
				'question.png'
			],
			'page-result-1': [
				'bg.png'
			],
			'page-result-2': [
				'bg.png'
			],
			'page-result-3': [
				'bg.png'
			]
		}
	}

	/**
	 * 根据imgs生成完整路径
	 * @param  {object} obj imgs
	 * @return {array}生成后的路径数组
	 */
	function createPath(obj) {
		var arr = [];
		var prefix = obj.pre;
		$.each(obj.list, function (key, value) {
			$.each(value, function (index, value) {
				arr.push(prefix + '/' + key + '/' + value);
			});
		});
		return arr;
	}

	/**
	 * 	自定义事件类
	 * @param {object} context 事件执行上下文
	 */
	var Event = Class.extend({
		init: function () {
			this.events = {};
			this.hasTrigger = {};
			this.defaultContext = this;
		},
		addEventListener: function (name, fn) {
			if(!this.events[name]) {
				this.events[name] = [];
			}
			this.events[name].push(fn);
		},
		removeEvent: function (name, fn) {
			var events = this.events[name];
			if(!fn) {
				this.events[name] = null;
			} else if(!events || !events.length) {
				return;
			} else {
				events.filter(function (value) {
					return value === fn;
				});
			}
		},
		trigger: function (name, context, data) {
			var events = this.events[name];

			if(!data) {
				data = context;
				context = this.defaultContext;
			}
			if(!events || !events.length) {
				return;
			}
			events.forEach(function (value) {
				if(typeof value === 'function') {
					value.apply(context, data);
				}
			});
		},
		triggerOnce: function (name, context, data) {
			if(!this.hasTrigger[name]) {
				this.hasTrigger[name] = true;
				this.trigger(name, context, data);
			}
		}
	});

	/**
	 * 	图片加载类
	 * @param {Array} arr 要加载的图片路径数组
	 * @param {Object} opt 选项
	 */
	var Loader = Event.extend({
		init:function (arr, opt) {
			this.opt = $.extend({}, this._defaultOpt, opt);
			this.imagesArr = arr.slice(0);
			this.totalCount = this.imagesArr.length;
			this.finshCount = 0;
			this.container = $(this.opt.container);
			this._super(this);
		},
		_defaultOpt: {
			parallelCount: 2,
			container: '.loading-img-wrap',
			type: {
				img: {event:'load', suffix:'jpg png gif'},
				audio: {event:'canplaythrough',suffix: 'wmv mp3 WAV'},
				vedio: {event:'canplaythrough',suffix: 'mp4'}
			}
		},
		create: function () {
			var that = this;
			for(var i = this.opt.parallelCount - 1; i >= 0; i--) {
				create();
			}
			function create(path, type) {
				if(!that.imagesArr.length) {
					return;
				}

				var path = that.imagesArr.shift();
				var typeObj = that.getType(path);
				var type = typeObj.type;
				var event = typeObj.event;
				var $media = $('<' + type + (type !== 'img' ? ' preload="auto"' : "") + ' />');

				$media.on(event, function() {
					that.finshCount++;
					that.triggerPrcoess();
					create();
				});
				that.container.append($media.attr('src', path));
			}
		},
		getType: function (str) {
			var suffix = str.substr(str.lastIndexOf('.') + 1);
			var types = this.opt.type;
			var type = "";
			var event = "";
			$.each(types, function (key, value) {
				if(value.suffix.indexOf(suffix) > -1) {
					type = key;
					event = value.event;
					return false;
				}
			});
			return {
				type: type,
				event: event
			};
		},
		bindWindowLoad: function () {
			var that = this;
			$(window).on('load', function () {
				that.triggerOnce('finish');
			});
		},
		triggerPrcoess: function () {
			var percent = this.finshCount / this.totalCount;
			this.trigger('process', [percent]);
			if(percent === 1) {
				this.triggerOnce('finish');
			}
		},
		start: function () {
			this.create();
		}
	});

	/**
	 * 	进度管理器
	 * @param {Array}
	 * @param {Object}
	 */
	var Process = Class.extend({
		init: function () {
			this.percent = 0;
			this.$_div = $('.loading div');
			this.$_img = $('.loading img');
			this.timmer = null;
			this.setHeadAnimate();
		},
		setProcess: function (percent) {
			this.percent = percent;
			
			this.$_div.css('width', percent * 100 + "%");
			this.$_img.css('left', percent * 100 + "%");
			if(percent === 1) {
				this.finish();
			}
		},
		setHeadAnimate: function () {
			var count = 0;
			var that = this;
			this.timmer = setInterval(function () {
				count++;
				that.$_img.attr('src','images/page0/head' + (count % 2 + 1) + '.png');
			}, 400);
		},
		finish: function () {
			clearInterval(this.timmer);
			$('.page0').hide();
			$(document.body).append($('#hide-textarea').val());
		}
	});
	
	var loader = new Loader(createPath(imgs));
	var proces = new Process();
	loader.addEventListener('process', proces.setProcess.bind(proces));
	this.loader = loader;
	this.Event = Event;
})($);