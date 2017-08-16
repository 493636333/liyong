(function (window) {
	(function() {
	    var lastTime = 0;
	    var vendors = ['webkit', 'moz'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
	                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
	            var id = window.setTimeout(function() {
	                callback(currTime + timeToCall);
	            }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	    if (!window.cancelAnimationFrame) {
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	    }
	}());
	var bird=function(option){
		var bird={},
			zhuziData=[],//柱子的高度
			oscore=document.getElementById(option.score),
			screen1=document.getElementById(option.screen1),
			screen2=document.getElementById(option.screen2),
			screen3=document.getElementById(option.screen3),
			zhuzi1=document.getElementById(option.zhuzi1),
			zhuzi2=document.getElementById(option.zhuzi2),
			zhuzi3=document.getElementById(option.zhuzi3),
			zhuzi4=document.getElementById(option.zhuzi4),
			zhuzi,
			obird=document.getElementById(option.bird),
			medal=document.getElementById(option.medal),
			gscope=document.getElementById(option.gscope),
			gbest=document.getElementById(option.gbest),
			restartButton=document.getElementById(option.restartButton),
			gameOverSpan=document.getElementById(option.gameOverSpan),
			gameOverControl=document.getElementById(option.gameOverControl),
			birdY=obird.offsetTop,//鸟的高度
			willZhuzi;//将要检验的柱子的高度.
		bird.config={
			speed:1,
			yDiff:112,
			birdTop:280
		};

		bird.getByClassName=function(element,className){
			function hasClass(node,className){  
				var cNames=node.className.split(/\s+/);//根据空格来分割node里的元素；  
				for(var i=0;i<cNames.length;i++){  
					if(cNames[i]==className) return true;  
				}  
				return false;  
			} 

			if(element.getElementByClassName){
				return element.getElementByClassName(className) //FF下因为有此方法，所以可以直接获取到；  
			}  
			var nodes=element.getElementsByTagName("*");//获取页面里所有元素，因为他会匹配全页面元素，所以性能上有缺陷，但是可以约束他的搜索范围；  
			var arr=[];//用来保存符合的className；  
			for(var i=0;i<nodes.length;i++){  
				if(hasClass(nodes[i],className)) arr.push(nodes[i]);  
			}  
			return arr;  
		} 
		//自定义事件模块
		bird.EventTarget=function ()
		{
			this.events={};//存储事件
		}
		bird.EventTarget.prototype.addHander=function(type,fn){
			if(this.events[type])//判断某个类型的事件是否有
			{
				var ifHaved=false;//判断事件处理函数是否重复
				for (var i = 0,len=this.events[type].length; i < len; i++) {
					if(this.events[type][i]===fn)
					{
						ifHaved=true;
					}
				}
				if(!ifHaved)
				{
					this.events[type].push(fn);//不重复就加入
				}
			}
			else
			{
				this.events[type]=[];
				this.events[type][0]=fn;
			}
		}
		bird.EventTarget.prototype.fire=function(event){
			var type=event.type;
			
			if(type&&this.events[type])
			{
				for (var i = 0,len=this.events[type].length; i < len; i++) {
					if(typeof this.events[type][i]=="function"){
						if(this.events[type][i].call(this,event)===false){
							return false;
						}
					}
				}
			}
		}

		//分数处理模块
		bird.score=function(){
			var score=0;
			return{
				addScore:function(){
					oscore.innerHTML=++score;
				},
				resetScore:function(){
					score=0;
					oscore.innerHTML=0;
				},
				getScore:function(){
					return score;
				}
			}
		}();
		//屏幕移动模块
		bird.screenMove=function(){
			var width=screen1.offsetWidth,//得到宽度
				fuWidth=-1*width,
				isFirst=true,//是不是第一次开始
				speed=bird.config.speed,
				timer,//计时器id
				ev=new bird.EventTarget(),
				screen1Left,//由于取dom的速度较慢，所以将left值存起来
				screen2Left,
				screen3Left;
			function loop(){
				screen1.style.left=(screen1Left-=speed)+"px";
				screen2.style.left=(screen2Left-=speed)+"px";
				screen3.style.left=(screen3Left-=speed)+"px";
				if(screen2Left<=fuWidth){
					screen1.style.display="none";
					ev.fire({type:"changeScreen",screen:"screen2"});
					screen2.style.left=width+"px";
					screen2Left=width;
				}
				if(screen3Left<=fuWidth){
					ev.fire({type:"changeScreen",screen:"screen3"});
					screen3.style.left=width+"px";
					screen3Left=width;
				}
				if(screen2Left>=-31&&screen2Left<=70||screen2Left>=-202&&screen2Left<=-101||screen3Left>=-31&&screen3Left<=70||screen3Left>=-202&&screen3Left<=-101){
					if(screen2Left===-31||screen2Left===-202||screen3Left===-31||screen3Left===-202){
						ev.fire({type:"pass"});
					}
					if(ev.fire({type:"ifpass"})===false){
						ev.fire({type:"gameOver"});
						return;
					}
				}
				if(screen2Left===-32||screen2Left===-203||screen3Left===-32||screen3Left===-203){
					willZhuzi=zhuziData.shift();
				}
				if(ev.fire({type:"frameFn"})===false){
					ev.fire({type:"gameOver"});
					return;
				}
				timer=requestAnimationFrame(loop);
			}
			function start(){
				ev.fire({type:"moveStart"});
				ev.fire({type:"moveStart"});
				willZhuzi=zhuziData.shift();
				loop();
			}
			function stop(){
				isFirst=true;
				cancelAnimationFrame(timer);
			}
			function resetScreen(){
				screen1.style.display="block";
				screen1.style.left="0px";
				screen2.style.left=width+"px";
				screen3.style.left=2*width+"px";
				screen1Left=screen1.offsetLeft;
				screen2Left=screen2.offsetLeft;
				screen3Left=screen3.offsetLeft;
			}
			return {
				start:start,
				stop:stop,
				event:ev,
				resetScreen:resetScreen
			}
		};

		//制造柱子模块
		bird.ceateZhuZi=function(){//一次造两个柱子
			var yDiff=bird.config.yDiff,
				y,//上柱子的高
				y2,//下柱子的高
				curZhuzi;
			function random(min,max){
				var a=min+Math.random()*(max-min);
				return Math.ceil(a);
			}
			for (var i = 0; i < 2; i++) {
				y=random(50,320);
				y2=472-y-yDiff;
				zhuziData.push(y);
				zhuzi.push(curZhuzi=zhuzi.shift());
				bird.getByClassName(curZhuzi,"top")[0].style.height=y+"px";//上柱子
				bird.getByClassName(curZhuzi,"bottom")[0].style.height=y2+"px";//下柱子

			};
		}
		bird.pzZhuzi=function(){//看看是否碰撞了柱子
			var y2=willZhuzi+bird.config.yDiff-28;
			return birdY>willZhuzi&&birdY<y2;
		}
		bird.pzDi=function(){//看看是否碰到了地
			return birdY<444;
		}
		bird.move=function(){
			var a=0.22,//加速度
				v=0,//速度
				obirdTimer,
				headTimer;
				function headDown(){
					obird.style.webkitTransition="transform 1.5s";
					obird.style.webkitTransform="rotate(90deg)";
				}
			return{
				rise:function (){
					clearTimeout(headTimer);
					a=0.22;
					v=-5;
					obird.style.webkitTransition="transform 0.5s";
					obird.style.webkitTransform="rotate(-25deg)";
					headTimer=setTimeout(headDown,500);
				},
				start:function(){
					v=0;
					document.body.addEventListener("click",bird.move.rise);
					document.body.addEventListener("keydown",bird.move.rise);
					obird.className="fly";
					function loop(){
						v+=a;
						if(v>5){
							a=0.1;
						}
						birdY+=v;
						obird.style.top=birdY+"px";
						obirdTimer=requestAnimationFrame(loop);
					}
					headDown();
					loop();
				},
				stop:function(){
					cancelAnimationFrame(obirdTimer);
				},
				dropDown:function(fn){
					var timer;
					document.body.removeEventListener("click",bird.move.rise);
					this.stop();
					clearTimeout(headTimer);
					obird.style.webkitTransition="";
					obird.style.webkitTransform="rotate(90deg)";
					obird.className="dropDown";
					function loop(){
						timer=requestAnimationFrame(loop);
						obird.style.top=(birdY+=7)+"px";
						if(birdY>=444){
							birdY=444;
							obird.style.top=444+"px";
							cancelAnimationFrame(timer);
							fn();
						}
					}
					loop();
				}
			}
		}();
		bird.highScore=function(){
			return{
				setHighScore:function(){
					var highScore=localStorage["flybirdhighScore"]||0,
						s=bird.score.getScore();
					if(highScore<s){
						localStorage["flybirdhighScore"]=s;
					}
				},
				getHighScore:function(){
					return localStorage["flybirdhighScore"]||0;
				}
			}
		}();
		bird.gameOverShowHidden=function(){
			return{
				gameOverShow:function(){
					oscore.style.display="none";
					gameOverSpan.className="show";
					bird.highScore.setHighScore();
					gscope.innerHTML=bird.score.getScore();
					gbest.innerHTML=bird.highScore.getHighScore();
					gameOverControl.className="show";
				},
				gameOverHidden:function(){
					oscore.style.display="block";
					gameOverSpan.className="hidden";
					gameOverControl.className="hidden";
				}
			}
		}();
		bird.gameOver=function(){
			bird.move.dropDown(bird.gameOverShowHidden.gameOverShow);
		}
		var screenMove=bird.screenMove();
		bird.init=function(){
			screenMove.event.addHander("moveStart",bird.ceateZhuZi);
			screenMove.event.addHander("changeScreen",bird.ceateZhuZi);
			screenMove.event.addHander("pass",bird.score.addScore);
			screenMove.event.addHander("ifpass",bird.pzZhuzi);
			screenMove.event.addHander("frameFn",bird.pzDi);
			screenMove.event.addHander("gameOver",bird.gameOver);
			bird.restart();
		}
		bird.restart=function(){
			obird.style.webkitTransition="";
			obird.style.webkitTransform="rotate(0deg)";
			obird.style.top=bird.config.birdTop+"px";
			birdY=bird.config.birdTop;
			screenMove.resetScreen();
			zhuzi=[zhuzi1,zhuzi2,zhuzi3,zhuzi4];
			zhuziData.length=0;
			bird.score.resetScore();
			document.body.addEventListener("click",function(){
				screenMove.start();
				bird.move.start();
				this.removeEventListener("click",arguments.callee);
			},false);
		}
		restartButton.addEventListener("click",function(){//为restartButton绑定click事件
			bird.gameOverShowHidden.gameOverHidden();
			setTimeout(bird.restart,10);
		},false);
		return bird;
	};
	window.bird=bird;
})(window);
var bird=bird({
	screen1:"screen1",
	screen2:"screen2",
	screen3:"screen3",
	zhuzi1:"zhuzi1",
	zhuzi2:"zhuzi2",
	zhuzi3:"zhuzi3",
	zhuzi4:"zhuzi4",
	score:"score",
	bird:"bird",
	medal:"medal",
	gscope:"gscope",
	gbest:"gbest",
	restartButton:"restartButton",
	gameOverSpan:"gameOverSpan",
	gameOverControl:"gameOverControl"
});

bird.init();