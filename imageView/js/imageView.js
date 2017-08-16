(function(window,undefined){
	
	//首先底层支持模块，与功能无关
	var base=function(wrapperId){
		return new base.prototype.init( wrapperId );
	};
	base.prototype.init=function(wrapperId){
		//暂时只支持dom对象和id选择器
		if(wrapperId.nodeType){
			this[0]=wrapperId;
		}
		else if(typeof wrapperId==="string"&&wrapperId.substr(0,1)==="#")
		{
			this[0]=document.getElementById(wrapperId.substr(1));
		}
		
	}
	//让new init出来的对象有base的原型方法
	base.prototype.init.prototype=base.fn=base.prototype;
	
	
	//下面全是工具方法，包括数据缓存，事件系统，浏览器测试，都为on方法做支持

	//对象扩展，只支持浅拷贝
	base.extend=function(des,source){
		if(!source){
			source=des;
			des=base;
		}
		for (var property in source) {
			des[property]=source[property];
		};
	}
	base.fn.extend=function(source){
		base.extend(base.fn,source);
	}
	//base的标志
	base.symbol="base"+(Math.random()+"").replace(/\D/,"");

	//唯一标志
	base.guid=1;
	
	//封装一些工具方法
	base.extend(base,{
		//数据缓存，由于ie防止循环引用，造成内存泄漏，还有ie的attachEvent的this指向，触发顺序都有问题，所以考虑基于数据缓存做事件处理

		//数据缓存，缓存到这里,只装事件的缓存
		cache:{
		},
		//这是不能为它添加私有属性的元素
		noData:{
			embed:true,
			object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			applet:true
		},
		//判断一个元素是否能附加扩展属性
		acceptData:function(element){
			var nodeName=element.nodeName,
				match;
			if(nodeName){
				match=base.noData[ nodeName.toLowerCase() ];
				if(match){
					return !(match===true||element.getAttribute("classid")!==match)
				}
				return true;
			}
		},
		//判断一个元素是否设置了缓存
		_hasData: function( element ) {
			return !!element[base.symbol];
		},
		_isEmptyObject:function(obj){
			//判断是不是个空对象，主要针对原生对象，并不支持类构造的对象
			for(var o in obj){
				return false;
			}
			return true;
		},

		//设置数据,只支持dom元素
		data:function(element,name,fn){
			if(!element.nodeType || !base.acceptData(element)){
				return
			}

			//主要有以下三种情况:
			//1.只有第一个参数：获取元素对应的cache  2.有第一、第二个参数，获取元素对应的cache[name]  3.有三个参数，将cache[name].push(fn)

			//如果没有设置缓存
			var key=base.symbol,
				id,
				cache,
				partCache;
			//如果没有设置数据
			if(!base._hasData(element)){
				id=element[key]=base.guid++;
				cache=base.cache[id]={};
			}
			else{
				id=element[key];
				cache=base.cache[id];
			}

			//现在cache肯定存在了,可以返回第一种情况了
			if(name===undefined){
				return cache;
			}
			partCache=cache[name]?cache[name]:(cache[name]=[]);
			//现在是第二种情况
			if(fn===undefined){
				return partCache;
			}
			partCache.push(fn);
			return cache;
		},
		
		//删除一条数据
		removeOneData:function(element,name,fn){
			var cache=base.data(element,name);
			for (var i=cache.length-1; i >=0; i--) {
				if(cache[i]===fn){
					cache.splice(i,1);
				}
			};
			return cache;
		},
		//删除一项数据缓存
		removeData:function(element,name){
			var cache,
				i=0;
			if(base._hasData(element)){
				cache=base.cache[ element[base.symbol] ];
				delete cache[name];
			}
			if(base._isEmptyObject(cache)){
				base.clearData(element);
			}
			return cache;
		},
		//清除所有数据缓存
		clearData:function(element){
			var mainCache=base.cache[ element[base.symbol] ];
			if(base._hasData(element)){
				delete base.cache[ element[base.symbol] ];
				//ie6，7，8不能直接删除属性，会出错，这里来捕获错误
				try{
					delete element[base.symbol];
				}
				catch(e){
					//ie低版本浏览器要用removeAttribute
					if(element.removeAttribute){
						element.removeAttribute(base.symbol);
					}
					else{
						//如果实在不得行，就直接设为null
						element[base.symbol]=null;
					}
				}
				
			}
		}
	});

	//封装事件系统，事件系统建立在数据缓存的基础上
	var addEvent=function(element,type,fn){
				element.addEventListener(type,fn,false);
		},
		attachEvent=function(element,type,fn){
			element.attachEvent("on"+type,fn);
		},
		removeEvent=function(element,type,fn){
			element.removeEventListener(type,fn,false);
		},
		detachEvent=function(element,type,fn){
			//ie6，7，8不能移出不存在的事件类型
			if(base.eventTypes.indexOf(type)>-1){
				element.detachEvent("on"+type,fn);
			}
		};
	base.extend(base,{
		//原生的注册事件,框架引入的时候会执行一次，下次就不会再判断了
		_addEvent:document.addEventListener?addEvent:attachEvent,
		//原生的解除事件绑定
		_removeEvent:document.addEventListener?removeEvent:detachEvent,
		//这里存储了可以注册的dom事件，jQuery中无论是否可以注册，都利用addEventListener或者attachEvent注册到dom元素上。
		//虽然现代浏览器是可以利用dispatchEvent实现自定义事件的触发，但是非现代浏览器这是不合理的，所以在此把可以绑定的事件列举出来
		//并没有列举全部，只列举了需要的一部分
		eventTypes:"mousedown mousemove mouseup mouseout mousewheel dragstart DOMMouseScroll click dblclick touchstart touchmove touchend load error",
		addEvent:function(element,type,fn){
			var mainFn,
				mainCache,
				len,
				i,
				cache;
			//过滤非dom元素和文本节点和注释节点
			if(element.nodeType&&( element.nodeType!==3 || element.nodeType!==8) ){
				cache=base.data(element,type);
				mainCache=base.data(element);
				//取出主监听函数
				mainFn=cache.mainFn;
				//如果主监听函数不存在，并且在可以注册的事件中存在，则定义主监听函数
				if(!mainFn&& base.eventTypes.indexOf(type)>=0){
					//注意，这里mainFn作用域里包含对element的引用
					mainFn=cache.mainFn=function(e){
						base.dispatch.apply(cache.element,arguments);
					}
					//为元素加上主监听函数
					base._addEvent(element,type,mainFn);
				}
				cache.element=element;
				//利用数据缓存将函数放进去
				cache.push(fn);
				//解除引用，避免内存泄漏
				fn=null;
				element=null;
			}
		},
		//事件分发,现在的this为绑定事件时的dom对象
		dispatch:function(event){
			event=base.fix(event);
			var handlers=base.data(this,event.type);
			for (var i = 0,len=handlers.length; i < len; i++) {
				handlers[i].apply(this,arguments);
			};
		},
		//移除一类事件或者移除某个单独处理函数
		removeEvent:function(element,type,fn){
			var mainFn=base.data(element,type).mainFn;
			if(fn===undefined){
				base._removeEvent(element,type,mainFn);
				base.removeData(element,type);
			}
			else{
				cache=base.removeOneData(element,type,fn);
				//如果cache已经被删除了
				if(!cache.length){
					base._removeEvent(element,type,mainFn);
					base.removeData(element,type);
				}
			}
		},
		//移除该对象所有的事件
		removeAllEvent:function(element){
			var cache;
			if(base._hasData){
				cache=base.data(element);
				for(var type in cache){
					base._removeEvent(element,type,cache[type].mainFn);
				}
				base.clearData(element);
			}
		}
	});

	//将原生事件对象包装成js对象，并对其做兼容
	base.Event=function(event){
		if(!(this instanceof base.Event)){
			return new arguments.callee(event);
		}
		
		this.originalEvent=event;
		this.type=event.type;
		this.target=event.target || event.srcElement;
	};
	//取消默认行为
	base.Event.prototype.preventDefault=function(){
		var e=this.originalEvent;
		if(e.preventDefault){
			e.preventDefault();
		}
		else{
			e.returnValue=false;
		}
	}
	base.fix=function(event){
		event=event||window.event;
		return new base.Event(event);
	}
	base.fixOffset=function(event){
		var rect,
			element=event.target,
			offset,
			originalEvent=event.originalEvent;
		if(originalEvent.offsetX!=null){
			event.offsetX=originalEvent.offsetX;
			event.offsetY=originalEvent.offsetY;
			return event;
		}
		//如果没有offsetX属性，比如firefox
		if(originalEvent.clientX!=null){
			//如果getBoundingClientRect方法存在
			// 事件在元素上的坐标=鼠标在窗口上的坐标-该元素的窗口坐标
			if(element.getBoundingClientRect){
				rect = element.getBoundingClientRect();
				event.offsetX=originalEvent.clientX-rect.left;
				event.offsetY=originalEvent.clientY-rect.top;
			}
			//如果没有getBoundingClientRect方法，只能用文档坐标和scorllTop,scorllLeft属性来变相取得元素的窗口坐标
			else{
				offset=base.offset(element);
				event.offsetX=originalEvent.clientX-(offset.left-document.body.scrollLeft);
				event.offsetY=originalEvent.clientY-(offset.top-document.body.scrollTop);
			}
		}
		return event;
	}
	//取得文档坐标的函数
	base.offset=function(elem){
		//忽略不在文档中的元素
		if ( !elem || !elem.ownerDocument ) {
			return null;
		}
		//特殊处理body元素
		if ( elem === elem.ownerDocument.body ) {
			return imageView.bodyOffset( elem );
		}

		var computedStyle,
		//父定位元素
		offsetParent = elem.offsetParent,
		//子定位元素
		prevOffsetParent = elem,
		//获得当前文档对象
		doc = document,
		//获得documentElement元素
		docElem = doc.documentElement,
		//获得当前文档的body
		body = document.body,
		//取得window对象
		defaultView = window,
		//取得子定位元素的ComputedStyle
		prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
		top = elem.offsetTop,
		left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			//如果这个元素是position是fixed，本身就是文档坐标了,直接跳出循环
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}
			//取得父定位元素的computedStyle
			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			//如果父元素有滚动条，要减去父元素的滚动距离，得到的才是我们所看到的距离,
			//也就是除了body或html的滚动条，其余的滚动条都不会参加计算，因为等下我们也只会减去body的滚动距离得到元素的窗口坐标
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				//加上与父定位元素的距离
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( base.support.doesNotAddBorder && !(base.support.doesAddBorderForTableAndCells) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( base.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}//while循环结束

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( base.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
	//对body做特殊处理，因为有些浏览器offsetTop,offsetLeft不包括margin
	base.bodyOffset=function(body){
		var top = body.offsetTop,
			left = body.offsetLeft;
		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( base.getComputedStyle(body, "marginTop") ) || 0;
			left += parseFloat( base.getComputedStyle(body, "marginLeft") ) || 0;
		}
		return { top: top, left: left };
	};
	//获取计算计算样式
	base.css=function(element,type){
		if(window.getComputedStyle){
			//修改base.css指针后，下次就不会再判断了
			base.css=function(ele,tp){
				return window.getComputedStyle(ele, null)[tp];
			}
			return window.getComputedStyle(element, null)[type];
		}
		else{
			base.css=function(ele,tp){
				return ele.currentStyle[tp];
			}
			return element.currentStyle[type];
		}
		//由于function内部有闭包，防止内存泄漏，设element为null;
		element=null;
	};

	base.ready=function(fn)
	{
		//用来装fn的，在未触发DOMContentLoaded之前，需要用一个数组把函数全部存起来
		var fnList=[],
			timer=null;
			
		fnList.push(fn);
		//标准的w3c浏览器
		if(document.addEventListener){
			document.addEventListener("DOMContentLoaded",function(){
				isReady=true;
				doFn();
				document.removeEventListener("DOMContentLoaded",arguments.callee,false);
			},false);
		}
		//古老的ie6,7,8
		else{
			//下面的测试会一直执行，直到DOMContentLoaded
			timer=setInterval(function(){
				var len,
					i=0;
				try{
					document.documentElement.doScroll('left');
					clearInterval(timer);
					doFn();
				}
				catch(e){
				}
			},10);
		}
		//等DOMContentLoaded后，所有的函数都会执行
		function doFn(){
			for (var i=0,len=fnList.length; i < len; i++) {
					fnList[i]();
			}
			doFn=null;
			fnList=null;
		}
		

		//上面所有代码只执行一次，以后只需要往fnList中push函数就可以了
		base.ready=function(fn){
			if(fnList){
				fnList.push(fn);
			}
		}
		fn=null;
	};

	//下面是拷贝的jquery的浏览器测试模块经过改造后，只截取了需要的一部分，bug就不解释为什么了,需要注意的是
	//此模块为自执行函数，且要在DOMContentLoaded事件后执行，主要的功能是为offsetX，offsetY兼容做底层支持。
	base.ready(function(){
		var container, outer, inner, table, td, offsetSupport,
		conMarginTop, ptlm, vb, style, html,support={},
		body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );
		div = document.createElement("div");
		container.appendChild( div );
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;
		support.doesNotAddBorder=( inner.offsetTop !== 5 );
		support.doesAddBorderForTableAndCells=( td.offsetTop === 5 );
		

		inner.style.position = "fixed";
		inner.style.top = "20px";
		support.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		support.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );
		body.removeChild( container );
		div  = container = null;
		base.support=support;
	});
	//上面的模块为底层支持模块，由于是自己写的，与jquery相比还有许多漏洞，所以不暴露出去,内部调用

	//实现一些必须的原型方法
	base.fn.extend({
		//注册事件，不支持事件代理，实际上本题也用不到
		on:function(type,fn){
			var element=this[0];
			base.addEvent(element,type,fn);
			return this;
		},
		//手动触发事件
		trigger:function(event){
			//这个event必须有type;
			var element=this[0];
			base.dispatch.call(element,event);
			return this;
		},
		//移除事件
		off:function(type,fn){
			//这个event必须有type;
			var element=this[0];
			//如果要移除所有事件
			if(type===undefined){
				base.removeAllEvent(element);
				return
			}
			base.removeEvent(element,type,fn);
			return this;
		},
		//获取计算样式或设置行内样式
		css:function(type,value){
			var element=this[0];
			if(value===undefined){
				return base.css(element,type);
			}
			else{
				element.style[type]=value;
			}
			return this;
		}
	});


	//为base库添加mousewheel事件插件，jQuery中并不存在，但是此题设计到，需要做一些兼容处理
	base.fn.extend({
		mousewheel:function(fn){
				var type=document.mozHidden !== undefined?"DOMMouseScroll":"mousewheel",
					//对绑定的函数进行包装，因为在执行这个函数之前先对其做下兼容。
					reallyfn=function(event){
						//阻止默认事件
						event.preventDefault();
						//修正offset属性
						event=base.fixOffset(event);
						var originalEvent=event.originalEvent;
						//小于0就是向上滚动，大于零就是向下滚动
						event.delta = (originalEvent.wheelDelta) ? originalEvent.wheelDelta / 120 : -(originalEvent.detail || 0) / 3;
						fn.apply(this,arguments);
					};
				this.on(type,reallyfn);
				return this;
			}
		}
	);

	//动画插件，由于此题不存在队列动画，所以没必要基于队列写。第三个参数为加速度，只实现了加速，减速，匀速动画
	//jquery中是基于对dom元素的操作完成动画，而本题是对handlers对象操作先更新Model再更新dom。
	//只能对width，height，top，left实现动画
	base.extend(base,{
		//Tween动画算法
		tween:{
			//t是一个递增的时间，b为初始位置，c为变化值，d为目标时间
			//可以用t和d来配合时间
	        linear:function (t, b, c, d) {
	            return c * t / d + b;
	        },
	        cubic:{
	            easeIn:function (t, b, c, d) {
	                return c * (t /= d) * t * t + b;
	            },
	            easeOut:function (t, b, c, d) {
	                return c * ((t = t / d - 1) * t * t + 1) + b;
	            },
	            easeInOut:function (t, b, c, d) {
	                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	                return c / 2 * ((t -= 2) * t * t + 2) + b;
	            }
	        }
    	},
		animate:function(option){
			// handlers,params,time,ease,frameFn,fn
			var handlers=option.handlers,
				params=option.params,
				ease=option.ease,
				time=option.time,
				frameFn=option.frameFn,
				curData=option.handlers.getCurImgSizeAndPositon(),
				curScaleN=option.handlers.getScaleN(),
				scaleChange=params.scale-curScaleN,
				xChange=params.x-curData.left,
				yChange=params.y-curData.top,
				t=0,
				step=50;
			handlers.stopAnimation&&handlers.stopAnimation();
			function run(){
				var x,y,scale;
				if(t<time){
					if(!isNaN(scaleChange)){
						scale=ease(t,curScaleN,scaleChange,time);
						handlers.scaleTo(scale);
					}
					if(!isNaN(xChange)){
						x=ease(t,curData.left,xChange,time);
						y=ease(t,curData.top,yChange,time);
						handlers.moveTo(x,y);
					}
				}
				else{
					params.scale!==undefined&&handlers.scaleTo(params.scale);
					params.x!==undefined&&handlers.moveTo(params.x,params.y);
					//如果完成，触发完成函数
				}
				if(frameFn&&frameFn()===false){
					t=time+1;
				}
				//默认步长为25
				if(t<time){
					timmer=setTimeout(arguments.callee,step);
				}else{
					//当动画完成后，挂在handlers上的停止动画的方法也要去掉.
					handlers.stopAnimation=null;
					option.complete&&option.complete();
				}
				t+=step;
			}
			run();
			//把停止动画的方法挂载在handlers上,因为当鼠标按下时，要结束所有动画,结束动画时，把必须做的做了.
			handlers.stopAnimation=function(){
				clearTimeout(timmer);
				option.must&&option.must();
				handlers.stopAnimation=null;
			}
		}
	});

	//为其添加一个cursor组件，主要是聚焦放大地方的功能
	base.cursor=function (parent,option){
			//容器宽高
		var	wrapWidth=parent.clientWidth,
			wrapHeight=parent.clientHeight,
			//当前值
			width=option.width||30,
			height=option.height||30,
			left=0,
			top=0,
			//最初值
			initWidth=width,
			initHeight=height,
			//颜色
			color=option.color||"blue",
			//容器中四个角的小长方形的宽高
			chang=option.chang||"20%",
			kuang=option.kuan||"2%",
			//容器的class
			className=option.className||"kuang",
			element=document.createElement("div"),
			style=document.createElement("style"),
			opacity;
		element.style.position="absolute";
		element.style.display="none";
		//其实这里直接在js中设置html并不好，但是为了方便调用，暂时先这样写吧。
		element.innerHTML="<div style='top:0;left:0;width:"+chang+";height:"+kuang+";' class="+className+"></div>"+
		"<div style='top:0;right:0;width:"+chang+";height:"+kuang+";' class="+className+"></div>"+
		"<div style='top:0;right:0;width:"+kuang+";height:"+chang+";' class="+className+"></div>"+
		"<div style='bottom:0;right:0;width:"+kuang+";height:"+chang+";' class="+className+"></div>"+
		"<div style='bottom:0;right:0;width:"+chang+";height:"+kuang+";' class="+className+"></div>"+
		"<div style='bottom:0;left:0;width:"+chang+";height:"+kuang+";' class="+className+"></div>"+
		"<div style='bottom:0;left:0;width:"+kuang+";height:"+chang+";' class="+className+"></div>"+
		"<div style='top:0;left:0;width:"+kuang+";height:"+chang+";' class="+className+"></div>";
		var ret={
			setOpacity:function(num){
				opacity=num;
				var str;
				if(document.addEventListener){
					str="opacity:"+opacity+";";
				}
				else{
					str="filter:Alpha(opacity="+opacity*100+");";
				}
				str="."+className+"{"+str+"background-color:"+color+";"+"position:absolute;}";
				style.type = "text/css";
				if (style.styleSheet) { //IE
				  style.styleSheet.cssText = str;
				} else { //w3c
				  style.innerHTML = str;
				}
			},
			setSize:function(w,h){
				width=w;
				height=h;
				element.style.width=width+"px";
				element.style.height=height+"px";
				if(left+width>wrapWidth){
					left=wrapWidth-width;
				}
				if(top+height>wrapHeight){
					top=wrapHeight-height;
				}
				this._setReallyPosition(left,top);
			},
			//设置位置是以框框的中心为坐标的
			setPosition:function(x,y){
				//x，y是相对于父容器的。
				if(x<width/2){
					x=width/2;
				}
				else if(x>wrapWidth-2/width){
					alert(x);
					x=wrapWidth-2/width;
				}
				if(y<height/2){
					y=height/2;
				}
				else if(y>wrapHeight-2/height){
					y=wrapHeight-2/height;
				}
				this._setReallyPosition(x-width/2,y-height/2);
			},
			_setReallyPosition:function(l,t){
				left=l;
				top=t;
				element.style.left=left+"px";
				element.style.top=top+"px";
			},
			//让框框显示出来
			show:function(wid,hei,ease,time){
				var t=0,
					_this=this,
					startWidth=width,
					startHeight=height,
					widthDiff=wid-startWidth,
					heightDiff=hei-startHeight;
				this.setOpacity(1);
				element.style.display="block";
				function run(){
					var h,w;
					if(t<time){
						h=ease(t,startHeight,heightDiff,time);
						w=ease(t,startWidth,widthDiff,time);
						_this.setSize(w,h);
					}
					else{
						_this.setSize(wid,hei);
					}
					if(t<time){
						setTimeout(arguments.callee,25);
					}
					t+=25;
				}
				run();
			},
			//让框框隐藏，设个时间和tween函数
			hide:function(time,ease){
				var t=0,
					_this=this,
					startOp=opacity,
					opacityDiff=0-startOp;
				function run(){
					if(t<time){
						var des=ease(t,startOp,opacityDiff,time);
						_this.setOpacity(des);
					}
					else{
						_this.setOpacity(0);
						element.style.display="none";
						_this.setSize(initWidth,initHeight);
					}
					if(t<time){
						setTimeout(arguments.callee,25);
					}
					t+=25;
				}
				run();
			},
			dispose:function(){
				element.innerHTML="";
				parent.removeChild(element);
				document.getElementsByTagName("head")[0].removeChild(style);
				element=null;
			}
		}
		ret.setSize(width,height);
		ret.setOpacity(1);
		document.getElementsByTagName("head")[0].appendChild(style);
		parent.appendChild(element);

		return ret;
	}
	
	//现在开始写功能模块,imageView依赖base模块，当然也可以换成jquery,与jquery唯一不同的地方就是实现了offsetX,offsetY的兼容
	//为什么要修正offsetX与offsetY？因为要放大图片的某一个点，必须找出这个点在图片上的坐标
	var imageView=function($){
		//id为容器的id，src为要查看图片的url,option为初始尺寸
		var imageView=function(id,src,option){
			var //新建的图片
				img,
				oElemnt=$(id),
				element=oElemnt[0],
				//容器的尺寸
				wrapWidth,
				wrapHeight,
				//图片的原始尺寸
				orignWidth,
				orignHeight,
				//下面这四个属性为img的初始值，是经过第一次的处理后的，之所以要记录是为了放大后还原到初始状态
				width,
				height,
				top,
				left,
				//下面这四个是当前值，与img元素保持一致，之所以需要是因为读取dom是非常慢的，同时也是MVC中的M部分，
				//之所以要在闭包里面访问是因为要与img元素保持一致，就不能在外部改变它们的值
				curWidth,
				curHeight,
				curTop,
				curLeft,
				//放大倍数
				scaleN=1,
				//这个记录img元素和imgObj对象的load完成数
				loadCount=0,
				handlers={
				//将model更新到view上
				paint:function(){
					this.movePaint();
					this.resizePaint();
				},
				//只更新位置
				movePaint:function(){
					img.style.top=curTop+"px";
					img.style.left=curLeft+"px";
				},
				//只更新大小
				resizePaint:function(){
					img.style.width=curWidth+"px";
					img.style.height=curHeight+"px";
				},
				//移动到一个特定的点
				moveTo:function(x,y){
					curTop=y;
					curLeft=x;
					this.movePaint();
				},
				//与当前位置相比，移动相对距离
				move:function(x,y){
					y+=curTop;
					x+=curLeft;
					this.moveTo(x,y);
				},
				//设置初始位置,除非自己设位置，否则是默认居中的
				setInitSize:function(w,h,t,l){
					curHeight=height=h;
					curWidth=width=w;
					if(t==undefined){
						this.centerWrapper();
						top=curTop;
						left=curLeft;
					}else{
						curTop=top=t;
						curLeft=left=l;
					}
					scaleN=1;
					this.paint();
				},
				//为了跟css3的scale一样，所以放大都是中心不移动的放大。
				scaleTo:function(beishu){
					scaleN=beishu;
					curWidth=width*beishu;
					curHeight=height*beishu;
					this.resizePaint();
				},
				//与moveTo一样，是相对的
				scale:function(s){
					s+=scaleN;
					this.scaleTo(s);
				},
				//回到最初的状态
				backInit:function(){
					this.scaleTo(1);
					this.moveTo(left,top);
				},
				//无论图片多大，都将图片放在容器的中间
				centerWrapper:function(){
					var y=(wrapHeight-curHeight)/2,
						x=(wrapWidth-curWidth)/2;
					this.moveTo(x,y);
				},
				//取得放大倍数
				getScaleN:function(){
					return scaleN;
				},
				//取得容器的大小
				getWrapperSize:function(){
					return{
						height:wrapHeight,
						width:wrapWidth
					}
				},
				//取得当前图片的各个属性
				getCurImgSizeAndPositon:function(){
					return{
						height:curHeight,
						width:curWidth,
						top:curTop,
						left:curLeft
					}
				},
				//取得初始化的各个属性
				getInitImgSizeAndPosition:function(){
					return{
						height:height,
						width:width,
						top:top,
						left:left
					}
				},
				//内部调用，主要为动画服务
				_getAniLeft:function(scale,offsetX,offsetY){
					var	//先求得最终大小，因为动画是用的最终大小
						finalWidth=width*scale,
						finalHeight=height*scale,
						//取得要移动到什么位置，因为要把放大的点尽量移到中间去
						oleft=wrapWidth/2-offsetX/curWidth*finalWidth,
						otop=wrapHeight/2-offsetY/curHeight*finalHeight;
					//这里判断是为了移不到中间去的时候，保证空白不露出来
					return{
						aniLeft:oleft>=0?0:(oleft<wrapWidth-finalWidth?wrapWidth-finalWidth:oleft),
						aniTop:otop>=0?0:(otop<wrapHeight-finalHeight?wrapHeight-finalHeight:otop)
					}
				},
				//同时移动和放大
				scaleByAnimationBoth:function(offsetX,offsetY,scaleAdd,controlFn,cursor){
					var _this=this;
						scale=scaleN+scaleAdd,
						ratioX=offsetX/curWidth,
						ratioY=offsetY/curHeight,
						aniPosition=this._getAniLeft(scale,offsetX,offsetY);
					$.animate({
						handlers:_this,
						params:{x:aniPosition.aniLeft,y:aniPosition.aniTop,scale:scale},
						time:500,
						frameFn:function(){
							var x=ratioX*curWidth+curLeft,
								y=ratioY*curHeight+curTop;
							cursor.setPosition(x,y);
						},
						ease:$.tween.cubic.easeIn,
						must:function(){
							controlFn();
							cursor.hide(200,$.tween.cubic.easeOut);
						},
						complete:function(){
							controlFn();
							cursor.hide(200,$.tween.cubic.easeOut);
						}
					});
				},
				//先放大，再移动
				scaleByAnimationNoBoth:function(offsetX,offsetY,scaleAdd,controlFn,noControlFn,cursor){
					var 
						_this=this,
						ratioX=offsetX/curWidth,
						ratioY=offsetY/curHeight,
						scale=scaleN+scaleAdd,
						wrapOffsetX=offsetX+curLeft,
						wrapOffsetY=offsetY+curTop
						aniPosition=this._getAniLeft(scale,offsetX,offsetY);
					cursor.setPosition(wrapOffsetX,wrapOffsetY);
					$.animate({
						handlers:_this,
						params:{scale:scale},
						time:500,
						ease:$.tween.cubic.easeIn,
						frameFn:function(){
							var nowX=ratioX*curWidth,
								nowY=ratioY*curHeight;
							_this.moveTo(wrapOffsetX-nowX,wrapOffsetY-nowY);
							cursor.setPosition(curLeft+nowX,curTop+nowY);
						},
						//当放大完成，就开始移动，变向实现了队列动画
						complete:function(){
							noControlFn();
							$.animate({
								handlers:_this,
								params:{x:aniPosition.aniLeft,y:aniPosition.aniTop},
								time:500,
								frameFn:function(){
									var nowX=ratioX*curWidth,
										nowY=ratioY*curHeight;
									cursor.setPosition(curLeft+nowX,curTop+nowY);
								},
								ease:$.tween.cubic.easeIn,
								must:function(){
									controlFn();
									cursor.hide(200,$.tween.cubic.easeOut);
								},
								complete:function(){
									controlFn();
									cursor.hide(200,$.tween.cubic.easeOut);
								} 
							});
						},
						//如果在放大的时候，鼠标按下，或双击，还是让control设为true
						must:function(){
							controlFn();
							cursor.hide(200,$.tween.cubic.easeOut);
						}
					});
				},
				//当鼠标移动的时候，需要知道真正移动的x,y，因为超过时，要变得难拖动。
				getMouseMovePosition:function(x,y){
					if(x>0){
						x=x/5
					}
					else if(x<wrapWidth-curWidth){
						x=4*(wrapWidth-curWidth)/5+x/5;
					}
					if(y>0){
						y=y/5
					}
					else if(y<wrapHeight-curHeight){
						y=4*(wrapHeight-curHeight)/5+y/5;
					}
					return {
						x:x,
						y:y
					}
				},
				//当鼠标抬起的时候，需要判断是否需要还原，因为可能有空白显示出来
				getMouseUpPosition:function(){
					var desX=curLeft,
						desY=curTop;
					if(desX>0){
						desX=0;
					}
					else if(desX<wrapWidth-curWidth){
						desX=wrapWidth-curWidth;
					}
					if(desY>0){
						desY=0;
					}
					else if(desY<wrapHeight-curHeight){
						desY=wrapHeight-curHeight;
					}
					if(desX!==curLeft||desY!==curTop){
						return {
							desX:desX,
							desY:desY
						}
					}
				}
				
			};

			//先将容器中可能存在的元素删除
			element.innerHTML="";
			//将容器的overflow设置为hidden;
			element.style.overflow="hidden";
			//查看图片一般来说不需要padding
			element.style.padding="0";
			//设置了padding后，就可以取容器的宽高了
			wrapWidth=element.clientWidth;
			wrapHeight=element.clientHeight;
			//如果容器的position为static,那么将其设置为relative,这样img才能实现绝对定位
			if(oElemnt.css("position")==="static"){
				oElemnt.css("position","relative");
			}
			img=document.createElement("img");
			$(img).on("load",function(){
						$(this).off("load",arguments.callee);
						setTimeout(function(){
							init();
							//触发自定义complete事件，将工具api与base框架作为参数传入，运用了观察者模式
							oElemnt.trigger({type:"complete",handlers:handlers,base:$});
						},0);
					//为其添加错误处理,把所有绑定的函数全部取消
					}).on("error",function(){
						oElemnt.off("complete");
						$(this).off("load");
						$(this).off("error");
					});
			img.style.position="absolute";
			element.appendChild(img);
			img.src=src;
			
			//init函数主要是设置dom中img元素的初始尺寸和width,height,top,left
			function init(){
				//可以自己设置宽高
				if(option instanceof Object){
					handlers.setInitSize(option.width,option.height,option.top,option.left);
					return;
				}
				handlers.setInitSize(wrapWidth,wrapHeight,0,0);
			}
			return {
				addEvent:function(type,fn){
					oElemnt.on(type,fn);
					return this;
				},
				dispose:function(){
					//先把img上所有的事件数据清除了
					$(img).off();
					//再移除img元素
					element.removeChild(img);
					//然后把element所有的事件全部清除
					$(element).off();
				}
			}
		}
		return imageView;
	}(base);
	//前面是基础模块

	//这是imageView的基础默认设置
	imageView.defaultOption={
		scaleAdd:0.4,
		scaleFn:"both",
		maxScale:2.8
	};
	//现在开始写真正与功能和事件相关，因为要把imageView暴露出去，所以就把功能相关的放在它的一个属性上,依赖imageView和base模块
	imageView.init=function(imageView,$){
		imageView.init=function(option){
			var opt={},
				dispose,
				cursor;
			$.extend(opt,imageView.defaultOption);
			$.extend(opt,option);

			//要等图片加载完成才给容器注册事件，如果加载失败，是不加事件的。
			var back=imageView(opt.id,opt.src,opt.size).addEvent("complete",function(ev){
					//取得base库
				var $=ev.originalEvent.base,
					//取得handlers工具，上面是对img操作的api
					handlers=ev.originalEvent.handlers,
					//取得图片的初始大小，因为后面经常用到，先提出来
					initSize=handlers.getInitImgSizeAndPosition(),
					
					//鼠标滚轮滑动一下，增加的放大倍数,默认增加0.4倍
					scaleAdd=opt.scaleAdd,
					//这个变量是控制放大动画的，动画完成前，不能操作。
					control=true;
				//新建一个cursor.
				cursor=base.cursor(this,{});
				//为容器对象绑定mousewheel事件
				$(this).mousewheel(function(event){
					//如果现在不允许操作，就直接返回
					if(control===false){
						return
					}
					//如果是向上滚动
					if(event.delta>0){
						control=false;
						cursor.show(80,80,$.tween.cubic.easeIn,250);
						if(scaleAdd>=opt.maxScale-handlers.getScaleN()){
							scaleAdd=opt.maxScale-handlers.getScaleN();
						}
						//先放大，再移动
						if(opt.scaleFn==="noboth"){
							handlers.scaleByAnimationNoBoth(event.offsetX,event.offsetY,scaleAdd,function(){control=true;},
							function(){control=false;},cursor);
						}
						//放大和移动同时进行
						else if(opt.scaleFn==="both"){
							handlers.scaleByAnimationBoth(event.offsetX,event.offsetY,scaleAdd,function(){control=true;},cursor);
						}
					}
				//增加双击缩小功能
				}).on("dblclick",function(){
					$.animate({
							handlers:handlers,
							params:{x:initSize.left,y:initSize.top,scale:1},
							time:500,
							ease:$.tween.cubic.easeIn,
							must:function(){
								control=true;
							},
							complete:function(){
								control=true;
							}
					});
				//增加拖拽功能
				}).on("mousedown",function(ev){
					//先把可能存在的动画清除掉
					handlers.stopAnimation&&handlers.stopAnimation();
					control=false;
					var 
						_this=this;
						curData=handlers.getCurImgSizeAndPositon();
						diffX=curData.left-ev.originalEvent.clientX,
						diffY=curData.top-ev.originalEvent.clientY;
					function move(ev){
						var clientX=ev.originalEvent.clientX,
							clientY=ev.originalEvent.clientY,
							mousePosition=handlers.getMouseMovePosition(diffX+clientX,diffY+clientY);
						handlers.moveTo(mousePosition.x,mousePosition.y);
					}
					//当鼠标起来的时候，需要判断是否需要还原
					function back(){
						var mouseupPosition=handlers.getMouseUpPosition();
							desX=mouseupPosition&&mouseupPosition.desX,
							desY=mouseupPosition&&mouseupPosition.desY;
						if(desX!==undefined){

							$.animate({
								handlers:handlers,
								params:{x:desX,y:desY},
								time:200,
								ease:$.tween.cubic.easeIn,
								complete:function(){
									control=true;
									handlers.moveTo(desX,desY);
								},
								must:function(){
									control=true;
									handlers.moveTo(desX,desY);
								}
							});
						}
						else{
							control=true;
						}
					}
					function up(){
						back();
						$(_this).off("mousemove",move);
						$(_this).off("mouseout",out);
						$(_this).off("mouseup",arguments.callee);
					}
					function out(){
						back();
						$(_this).off("mousemove",move);
						$(_this).off("mouseup",up);
						$(_this).off("mouseout",arguments.callee);
					}
					$(_this)
						.on("mousemove",move)
						.on("mouseup",up)
						.on("mouseout",out);
				//把drag事件的默认行为取消了，不然图片要跟着跑
				}).on("dragstart",function(ev){
					ev.preventDefault();
				});
			});
			//这个组件需要一个销毁方法。
			return {
				dispose:function(){
					back.dispose();
					cursor.dispose();
				}	
			}
		}
		
		return imageView.init;
	}(imageView,base);
	
	//让imageView支持amd加载
	if ( typeof define === "function" && define.amd ) {
		define( "imageView", [], function () { return base; } );
	}

	//将模块挂载到window上
	window.imageView=imageView;
})(window)