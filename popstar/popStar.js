<!--游戏框架开始-->
	(function(window,undefined){
		//这里是requestAnimationFrame模块

		window.requestAnimFrame = (function(){  
	        return  window.requestAnimationFrame       ||   
	        window.webkitRequestAnimationFrame ||   
	        window.mozRequestAnimationFrame    ||   
	        window.oRequestAnimationFrame      ||   
	        window.msRequestAnimationFrame     ||   
	        function( callback ){  
	            window.setTimeout(callback, 1000/60);  
	        };  
		})(); 
		var game=null,
			isOnControl=true;
		//这里是event工具模块
		var eventUntil={
			getEvent:function(ev)
			{
				return ev||window.event;
			},
			getFullEvent:function(offsetLeft,offsetTop,event){
				var x=event.offsetX||event.clientX-offsetLeft;//事件发生时坐标相对于canvas
				var y=event.offsetY||event.clientY-offsetTop;
				event.X=x;
				event.Y=y;
				return event;
			},
			preventDefault:function(ev){
				ev.preventDefault();
				ev.returnValue=false;
			} 
		}

		//这里是自定义事件模块
		var EventTarget=function(){
			function EventTarget()
			{
				this.events={};//存储事件
			}
			EventTarget.prototype.addHander=function(type,fn){
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
			EventTarget.prototype.fire=function(event){
				var type=event.type;
				
				if(type&&this.events[type])
				{
					for (var i = 0,len=this.events[type].length; i < len; i++) {
						typeof this.events[type][i]=="function"&&this.events[type][i].call(this,event);
					}
				}
			}
			EventTarget.prototype.removeHander=function(type,fn){
				if(typeof this.events[type]!=="undefined")
				{
					for (var i = 0,len=this.events[type].length; i < len; i++) {
						if(this.events[type][i]===fn)
						{
							this.events[type].splice(i,1);
							break;
						}
					}
				}
			}
			return EventTarget;
		}();

		var inherit={
			inheirtPrototype:function(child,parent){//继承原型函数
				function O(){};
				O.prototype=parent.prototype;
				var o=new O();
				o.constructor=child;
				child.prototype=o;
			},
			extend:function(needExtendClass,obj){////扩展函数，由于不只扩展一个类，所以写成函数形式
				for (var o in obj) {
					if(obj.hasOwnProperty(o)){
						needExtendClass.prototype[o]||(needExtendClass.prototype[o]=obj[o]);
					}
				};
			}
		}
		//这里是游戏里实物模块
		var Shape=function(superModule,inherit){
			//实物模块需要使用自定义事件模块
			var EventTarget=superModule;

			//构建一个空对象，为模块返回对象
			var Shape={};
			var eventtarget=new EventTarget();
			Shape.publicMethod=eventtarget;
			
			//这里是基础形状类
			function baseShape(x,y){
				EventTarget.call(this);
				this.x=x;
				this.y=y;
			}

			inherit.inheirtPrototype(baseShape,EventTarget);
			inherit.extend(baseShape,{
					move:function(x,y,isNowPaint){
						this.x+=x;
						this.y+=y;
						(typeof isNowPaint=='undefined'||isNowPaint)&&eventtarget.fire({type:"draw"});
					},
					moveTo:function(x,y,isNowPaint){
						this.x=x;
						this.y=y;
						(typeof isNowPaint=='undefined'||isNowPaint)&&eventtarget.fire({type:"draw"});
					}
				}
			);
			
			var img_url=[
					"img/red.jpg",
					"img/blue.jpg",
					"img/green.jpg",
					"img/yellow.jpg",
					"img/pink.jpg"
				],
				img_select_url=[
					"img/red_select.jpg",
					"img/blue_select.jpg",
					"img/green_select.jpg",
					"img/yellow_select.jpg",
					"img/pink_select.jpg"
				];
			//图像类
			Shape.Img=function(x,y,intSrc,context){
				var src=["red","blue","green","yellow","pink"];
				var hOrw=27;
				var X=x*hOrw,
					Y=y*hOrw;
				this.context=context;
				baseShape.call(this,X,Y);
				this.w=hOrw;
				this.h=hOrw;
				this.intSrc=intSrc-1;
				this.src=img_url[this.intSrc];
			}
			inherit.inheirtPrototype(Shape.Img,baseShape);//让矩形继承于基本形状
			inherit.extend(Shape.Img,{
					draw:function(){
						var _this=this;
						var context=this.context;
						var img=new Image();
						img.onload=function(){
							context.drawImage(img,_this.x,_this.y,_this.w,_this.h);
						}
						img.src=this.src;
					},
					select:function(){
						this.src=img_select_url[this.intSrc];
						this.context.clearRect(this.x,this.y,this.w,this.h);
						this.draw();
					},
					unselect:function(){
						this.src=img_url[this.intSrc];
						this.context.clearRect(this.x,this.y,this.w,this.h);
						this.draw();
					},
					reduce:function(){
						this.context.clearRect(this.x,this.y,this.w,this.h);
						this.x++;
						this.y++;
						this.w-=2;
						this.h-=2;
						this.draw();
					},
					dispose:function(){
						this.context.clearRect(this.x,this.y,this.w,this.h);
					},
					goDown:function(distance){
						this.context.clearRect(this.x,this.y,this.w,this.h);
						this.y+=distance;
						this.draw();
					},
					goLeft:function(distance){
						this.context.clearRect(this.x,this.y,this.w,this.h);
						this.x-=distance;
						this.draw();
					}
				}
			);
			
			return Shape;
		}(EventTarget,inherit);

		var animation=function(EventTarget,inherit){//动画模块
			function GoDown(distance){//每一个要往下掉的列都要实例化一个GoDown对象
				this.initDistance=0;
				this.distance=distance;//要往下掉多少
				this.elements=[];//将要往下的元素
				
			}
			GoDown.prototype.start=function(){
				for (var i = 0,len=this.elements.length; i < len; i++) {
					this.elements[i].goDown(9);
				};
				this.initDistance+=9;
			}
			GoDown.prototype.isDone=function(){
				return this.initDistance>=this.distance;
			}

			function GoLeft(distance){//将要往左移动的
				this.initDistance=0;
				this.distance=distance;
				this.elements=[];
			}
			
			GoLeft.prototype.start=function(){
				for (var i = 0,len=this.elements.length; i < len; i++) {
					this.elements[i].goLeft(9);
				};
				this.initDistance+=9;
			}
			GoLeft.prototype.isDone=function(){
				return this.initDistance>=this.distance;
			}

			function Animation(){
				this.downs=[];
				this.lefts=[];
				EventTarget.call(this);
			}
			inherit.inheirtPrototype(Animation,EventTarget)//让Animation类也拥有自定义事件
			Animation.prototype.start=function(){
				if(this.downs.length==0)
				{
					this.goLeft();
				}
				else{
					this.goDown();
				}
			}
			Animation.prototype.goDown=function(){
				var _this=this;
				var len=_this.downs.length;
				if(len>0)
				{
					setTimeout(function(){
						var notDoneCount=0;
						for (var i = 0; i < len; i++) {
							if(!_this.downs[i].isDone()){
								notDoneCount++;
								_this.downs[i].start();
							}
						};
						if(notDoneCount==0)//如果向下的全部完成，则向左
						{
							_this.goLeft();
						}
						else//如果还有没完成的列，就继续
						{
							_this.goDown();
						}
					},30);
				}
			}
			Animation.prototype.goLeft=function(){
				var _this=this;
				var len=_this.lefts.length;
				if(len>0)
				{
					setTimeout(function(){
						var notDoneCount=0;
						for (var i = 0; i < len; i++) {
							if(!_this.lefts[i].isDone()){
								notDoneCount++;
								_this.lefts[i].start();
							}
						};
						if(notDoneCount==0)
						{
							_this.fire({type:"done"});
						}
						else//如果还有没完成的，就继续
						{
							_this.goLeft();
						}
					},30);
				}
				else
				{
					this.fire({type:"done"});
				}
			}
			return{
				GoDown:GoDown,
				GoLeft:GoLeft,
				Animation:Animation
			}
		}(EventTarget,inherit);

		var mapModify=function(EventTarget,inherit){//map和elements的矫正模块
			function GoDown(map,elements,distance,x,start,end){//每一个要往下掉的列都要实例化一个GoDown对象
				this.map=map;
				this.elements=elements;
				this.distance=distance;//要往下掉多少
				this.x=x;
				this.start=start;
				this.end=end;
			}
			GoDown.prototype.run=function(){
				var x=this.x,
					map=this.map,
					elements=this.elements,
					distance=this.distance,
					start=this.start,
					end=this.end;
				for(var i=start;i>end;i--)
				{
					map[i+distance][x]=map[i][x];
					map[i][x]=0;
					elements[i+distance][x]=elements[i][x];
					elements[i][x]=null;
				}
			}
			
			function GoLeft(map,elements,distance,start,end){//将要往左移动的
				this.map=map;
				this.elements=elements;
				this.distance=distance;
				this.start=start;
				this.end=end;
			}
			
			GoLeft.prototype.run=function(){
				var map=this.map,
					elements=this.elements,
					distance=this.distance,
					start=this.start,
					end=this.end;
				for(var i=start;i<end;i++)
				{
					for(var j=map.length-1;j>=0;j--)
					{
						map[j][i-distance]=map[j][i];
						map[j][i]=0;
						elements[j][i-distance]=elements[j][i];
						elements[j][i]=null;
					}
				}
			}
			
			function Animation(){
				EventTarget.call(this);
				this.downs=[];
				this.lefts=[];
			}
			inherit.inheirtPrototype(Animation,EventTarget);
			Animation.prototype.start=function(){
				this.goDown();
				this.goLeft();
				isOnControl=true;
				this.fire({type:"done"});
			}
			Animation.prototype.goDown=function(){
				var downs=this.downs;
				for (var i = 0,len=downs.length; i < len; i++) {
					downs[i].run();
				};
			}
			Animation.prototype.goLeft=function(){
				var lefts=this.lefts;
				for (var i = 0,len=lefts.length; i < len; i++) {
					lefts[i].run();
				};
			}
			return{
				GoDown:GoDown,
				GoLeft:GoLeft,
				Animation:Animation
			}
		}(EventTarget,inherit);

		//判断是否结束模块
		var judgeIsEnd=function(){
			function isEnd(map)
			{
				var isfullZero=true,
					have=false,
					count=0;
				for (var i = map.length-1; i>=0; i--) {
					for (var j = 0; j < 10; j++) {
						if(map[i][j]!==0)
						{
							isfullZero=false;
							count++;
							var value=map[i][j];
							if(i-1>=0&&map[i-1][j]==value) //上
							{
								have=true;
								break;
							}
							if(i+1<=9&&map[i+1][j]==value) //下
							{
								have=true;
								break;
							}
							if(j-1>=0&&map[i][j-1]==value) //左
							{
								have=true;
								break;
							}
							if(j+1<=9&&map[i][j+1]==value) //右
							{
								have=true;
								break;
							}
						}
					}
					if(have===true)
					{
						break;
					}
				}
				return {
					isEnd:isfullZero||!have,
					count:count
				}
				
			}
			return isEnd;
		}();

		//这里是小星星散落动画的模块
		var StarAnimation=function(){
			function Star(x,y,r,color,context){
				this.context=context;
				this.x=x;
				this.y=y;
				this.r=r;
				this.color=color;
				var arr=[],
					hudu=2*Math.PI/360*18,
					cos1=Math.cos(hudu),
					sin1=Math.sin(hudu),
					tan2=Math.tan(2*hudu),
					cos2=Math.cos(2*hudu),
					sin2=Math.sin(2*hudu),
					cos3=Math.cos(3*hudu),
					sin3=Math.sin(3*hudu),
					r1=r*sin1/cos2;
				 	arr[0]={
						x:x-r*cos1,
						y:y-r*sin1
					};
					arr[1]={
						x:x-r*sin1*tan2,
						y:y-r*sin1
					};
					arr[2]={
						x:x,
						y:y-r
					};
					arr[3]={
						x:x+r*sin1*tan2,
						y:y-r*sin1
					};
					arr[4]={
						x:x+r*cos1,
						y:y-r*sin1
					};
					arr[5]={
						x:x+r1*cos1,
						y:y+r1*sin1
					};
					arr[6]={
						x:x+r*cos3,
						y:y+r*sin3
					};
					arr[7]={
						x:x,
						y:y+r1
					};
					arr[8]={
						x:x-r*cos3,
						y:y+r*sin3
					};
					arr[9]={
						x:x-r1*cos1,
						y:y+r1*sin1
					};
				this.points=arr;
			}
			Star.prototype.draw=function(){
				var arr=this.points,
					context=this.context;
				context.strokeStyle=this.color;
				context.fillStyle=this.color;
				context.moveTo(arr[0].x,arr[0].y)
				context.beginPath();
				for(var i=0;i<10;i++)
				{
					context.lineTo(arr[i].x,arr[i].y)
				}
				context.closePath();
				context.fill();
			}
			Star.prototype.move=function(x,y){
				var arr=this.points;
				this.x+=x;
				this.y+=y;
				for (var i = 0; i < 10; i++) {
					arr[i].x+=x;
					arr[i].y+=y;
				};
				this.draw();
			}
			Star.prototype.moveTo=function(x,y){
				var diffX=x-this.x,
					diffY=y-this.y; 
				this.move(diffX,diffY);
			}
			function Stars(x,y,intColor,context){
				var count=5,
					r=7,
					stars=[],
					colors=["#9D172F","#14A4D9","#56CF6E","#E8CF2C","#CD60CD"];
				for (var i = 0; i < count; i++) {
					var star=new Star(x,y,r,colors[intColor],context);
					star.xSpeed=random(-2,2);
					star.ySpeed=random(-5,-7);
					stars[i]=star;
				};
				this.context=context;
				this.stars=stars;
			}
			function random(min,max){
				return Math.random()*(max-min)+min;
			}
			Stars.prototype.start=function(){
				var a=0.5,
					stars=this.stars,
					ySpeed;
				for (var i = 0,len=stars.length; i < len; i++) {
					ySpeed=(stars[i].ySpeed+=0.5);
					xSpeed=stars[i].xSpeed;
					stars[i].move(xSpeed,ySpeed);
				};
			}

			var canvas=null;
			function addCanvas(oCanvas){
				canvas=oCanvas;
			}
			function StarAnimation(selectElements){
				this.context=canvas.getContext("2d");
				this.canvas=canvas;
				this.stars=[];
				this.t=0;
				for(var o in selectElements){
					if(o!=="length")
					{
						var x=selectElements[o].x+13,
							y=selectElements[o].y+13,
							intColor=selectElements[o].intSrc;
						this.stars.push(new Stars(x,y,intColor,this.context));
					}
				}
			}
			StarAnimation.prototype.start=function(){
				this.canvas.style.display="block";
				var stars=this.stars;
				this.t+=16.7;
				this.context.clearRect(0,0,270,270);
				if(this.t<700)
				{
					requestAnimFrame(this.start.bind(this));
				}
				else
				{
					this.canvas.style.display="none";
					return
				}
				for (var i = 0,len=stars.length; i < len; i++) {
					stars[i].start();
				};
			}
			function EndStarAnimationBoom(map,elements){
				var x,y,intColor;
				this.elements=elements;
				this.map=map;
				this.stars=[];
				this.runStars=[];
				this.a=0;
				this.t=0;
				this.daojishi=0;
				this.isDaojishiOn=false;
				this.context=canvas.getContext("2d");
				for (var i = 0,len1=map.length; i <len1 ; i++) {
					for (var j = 0,len2=map[0].length; j < len2; j++) {
						if(map[i][j]){
							x=j*27+13;
							y=i*27+13;
							intColor=map[i][j]-1;
							var star=new Stars(x,y,intColor,this.context);
							star.X=j;
							star.Y=i;
							this.stars.push(star);
						}
					};
				};
			}
			EndStarAnimationBoom.prototype.start=function(){
				var stars=this.stars,
					runStars=this.runStars,
					elements=this.elements,
					X,Y;
				this.t+=16.7;
				if(stars.length>0||runStars.length>0)
				{
					this.context.clearRect(0,0,270,270);
					canvas.style.display="block";
					if(stars.length>0&&this.t>400)
					{
						this.t=0;
						this.a++;
						if(stars.length>0)
						{
							if(this.a<=3)
							{
								var star=stars.shift();
								elements[star.Y][star.X].dispose();
								runStars.push(star);
							}
							else
							{
								for (var i = 0,len=stars.length; i < len; i++) {
									var star=stars.shift();
									elements[star.Y][star.X].dispose();
									runStars.push(star);
								};
							}
						}
						if(stars.length==0)
						{
							this.isDaojishiOn=true;
						}
					}
					for (var i = 0,len=runStars.length; i < len; i++) {
						runStars[i].start();
					};
					this.isDaojishiOn&&(this.daojishi+=16.7);
					if(this.daojishi>700){
						game.judgeIfNext();
						this.context.clearRect(0,0,270,270);
						canvas.style.display="none";
					}
					else{
						requestAnimFrame(this.start.bind(this));
					}
				}
				else{
					game.judgeIfNext();
				}
			}
			return {
				StarAnimation:StarAnimation,
				addCanvas:addCanvas,
				EndStarAnimationBoom:EndStarAnimationBoom
			}
		}();

		var modify=function(animation,mapModify,judgeIsEnd){//这里是过渡模块，用来动画准备。初始化lefts和downs
			function Transition(map,elements,selectElements){
				this.map=map;
				this.elements=elements;
				this.selectElements=selectElements;
				this.mapModify=new mapModify.Animation();//准备动画的同时，也要准备map和elements的矫正
				this.mapModify.addHander("done",function(){
					var result=judgeIsEnd(map),
						count=result.count;
					if(result.isEnd){
						game.setEndScore(count);
						var star=new StarAnimation.EndStarAnimationBoom(map,elements);
						game.twinkle(star.start.bind(star));
					}
				});
			}
			Transition.prototype.start=function(){
				var ani=new animation.Animation();
				ani.downs=this.cellsAnimathion();
				ani.lefts=this.cellsLeft();
				ani.addHander("done",this.animationDone.bind(this));//当动画播放完以后，开始矫正map和elements
				ani.start();
			}
			Transition.prototype.animationDone=function(){
				this.mapModify.start();
			}
			Transition.prototype.cell=function(){
				var selectElements=this.selectElements;
					cell={};//用来存消了哪些列.
				for(var o in selectElements)
				{
					if(o!=="length")
					{
						var X=o.split("_")[1];
						if(!cell[X])
						{
							cell[X]=true;
						}
					}
				}
				return cell;
			}
			Transition.prototype.cellsLeft=function(){//获取向左的GoLeft类的集合
				var cell=this.cell(),
					elements=this.elements,
					map=this.map,
					noElements=true,//没有元素
					goLefts=[],
					mapLen=map.length,
					empCells=[];//用来装哪些列是空的
				for(var o in cell)
				{
					noElements=true;
					for (var i = mapLen-1; i >= 0; i--) {
						if(map[i][o]!=0)
						{
							noElements=false;
						}
					}
					if(noElements)
					{
						empCells.push(+o);
					}
				}
				if(empCells.length>0)
				{
					empCells.sort();
					var empCount=0;
					for (var j = 0,len=empCells.length; j < len; j++) {
						var cellIndex=empCells[j];
						empCount++;
						while(j+1!=len&&cellIndex+1==empCells[j+1])
						{
							empCount++;
							j++;
							cellIndex=empCells[j];
						}
						var	nextCellIndex=(j+1==len)?mapLen-1:empCells[j+1]-1,
							goLeft=new animation.GoLeft(empCount*27);
							this.mapModify.lefts.push(new mapModify.GoLeft(map,elements,empCount,cellIndex+1,nextCellIndex+1));
						for (var i = cellIndex+1; i <= nextCellIndex; i++) {
							for (var k = map.length-1; k >=0; k--) {
								if(map[k][i]!==0)
								{
									goLeft.elements.push(elements[k][i]);
								}
							}
						}
						if(goLeft.elements.length>0)
						{
							goLefts.push(goLeft);
						}
					}
					return goLefts;
				}
				else
				{
					return goLefts;
				}
			}
			Transition.prototype.cellsAnimathion=function(){
				var selectElements=this.selectElements;
					cell=this.cell();//用来存消了哪些列.
					godowns=[];
				for(var x in cell)
				{
					var cellIndex=+x;
					var arr=this.cellAnimathion(cellIndex);
					if(arr.length>0)
					{
						godowns=godowns.concat(arr);
					}
				}
				return godowns;
			}
			Transition.prototype.cellAnimathion=function(cellIndex){
				var godowns=[],
					map=this.map,
					elements=this.elements,
					count=0,
					isHaveZero=false,
					isPushElement=false,
					goDown=new animation.GoDown(27*count),
					mapGodown,//下面四个变量都是为了map的矫正
					isFirstElement=false,
					start=map.length,
					end=start;
				for (var i =map.length-1; i >=0; i--) {
					if(map[i][cellIndex]==0)
					{
						isFirstElement=true;
						isHaveZero=true;
						if(isPushElement)//必须第一次刚刚才经过push
						{
							end=i;
							godowns.push(goDown);
							isPushElement=false;
							this.mapModify.downs.push(new mapModify.GoDown(map,elements,count,cellIndex,start,end));
						}
						count++;
						goDown=new animation.GoDown(27*count);
					}
					else
					{
						if(isFirstElement)
						{
							start=i;
						}
						if(isHaveZero)//必须下面有0才能push
						{
							isFirstElement=false;
							goDown.elements.push(elements[i][cellIndex]);
							isPushElement=true;
						}
					}
					if(i==0&&goDown.elements.length>0)
					{
						godowns.push(goDown);
						end=-1;
						this.mapModify.downs.push(new mapModify.GoDown(map,elements,count,cellIndex,start,end));
					}
				};
				return godowns;
			}
			return Transition;
		}(animation,mapModify,judgeIsEnd);
		
		

		//这里是判断模块
		var Judge=function(inherit,modify){
			function JudgeSelect(map,elements){
				this.elements=elements;
				this.map=map;
				this.selectElements={
					length:0
				};//用来装选择了的对象
			}
			inherit.extend(JudgeSelect,{
				judge:function(x,y){
					var arr=this.map;
					var elements=this.elements;
					var relsObj=this.selectElements;
					if(arr[y][x]==0)
					{
						return;
					}
					relsObj[y+"_"+x]=elements[y][x];
					judgeIfChecked(arr,x,y);
					if(relsObj.length>0)//如果选择的方块大于1，则把自己也加上
					{
						relsObj.length++;
					}
					else{
						delete relsObj[y+"_"+x];
					}
					function judgeIfChecked(arr,x,y)
					{
						var value=arr[y][x];
						if(y-1>=0&&arr[y-1][x]==value&&!relsObj[(y-1)+"_"+x]) //上
						{
							relsObj[(y-1)+"_"+x]=elements[y-1][x];
							relsObj.length++;
							judgeIfChecked(arr,x,y-1);
						}
						if(y+1<=9&&arr[y+1][x]==value&&!relsObj[(y+1)+"_"+x]) //下
						{
							relsObj[(y+1)+"_"+x]=elements[y+1][x];
							relsObj.length++;
							judgeIfChecked(arr,x,y+1);
						}
						if(x-1>=0&&arr[y][x-1]==value&&!relsObj[y+"_"+(x-1)]) //左
						{
							relsObj[y+"_"+(x-1)]=elements[y][x-1];
							relsObj.length++;
							judgeIfChecked(arr,x-1,y);
						}
						if(x+1<=9&&arr[y][x+1]==value&&!relsObj[y+"_"+(x+1)]) //右
						{
							relsObj[y+"_"+(x+1)]=elements[y][x+1];
							relsObj.length++;
							judgeIfChecked(arr,x+1,y);
						}
					}
				},
				select:function(){
					var selectElements=this.selectElements;
					for(var o in selectElements)
					{
						if(o!=="length")
						{
							selectElements[o].select();
						}
					}
				},
				unselect:function(){
					var selectElements=this.selectElements;
					for(var o in selectElements)
					{
						if(o!=="length")
						{
							selectElements[o].unselect();
						}
					}
					this.selectElements={length:0};
				},
				selectDele:function(){
					var _this=this;
					var selectElements=this.selectElements;
					// setTimeout(function(){
					// 	var isContiniue=false;
					// 	for(var o in selectElements)
					// 	{
					// 		if(o!=="length")
					// 		{
					// 			if(selectElements[o].w>=2)
					// 			{
					// 				isContiniue=true;
					// 				selectElements[o].reduce();
					// 			}
					// 			else//如果width=0，就擦除
					// 			{
					// 				selectElements[o].dispose();
					// 			}
					// 		}
					// 	}
					// 	if(isContiniue)//如果选择的星星还没缩小完，就继续缩小
					// 	{
					// 		_this.selectDele();
					// 	}
					// 	else//如果缩小完了
					// 	{
					// 		_this.modifyMapAndElements();//把map和elements相应位置变成0和null
					// 		_this.transition();//过渡模块启动
					// 		_this.selectElements={length:0};
					// 	}
					// },30);
					function starAnimationDone()
					{
						_this.modifyMapAndElements();//把map和elements相应位置变成0和null
						_this.transition();//过渡模块启动
						_this.selectElements={length:0};
					}
					for(var o in selectElements)
					{
						if(o!=="length")
						{
							selectElements[o].dispose();
						}
					}
					setTimeout(starAnimationDone.bind(this),400);
					new StarAnimation.StarAnimation(selectElements).start();

				},
				transition:function(){
					var animation=new modify(this.map,this.elements,this.selectElements);
					animation.start();
				},
				modifyMapAndElements:function(){
					var selectElements=this.selectElements,
						map=this.map,
						elements=this.elements;
					for(var o in selectElements)
						{
							if(o!=="length")
							{
								var Y_X=o.split("_"),
									Y=+Y_X[0];
									X=+Y_X[1];
									map[Y][X]=0;
									this.elements[Y][X]=null; 
							}
						}
				},
				addElement:function(x,y){
					var selectElements=this.selectElements;
					var length=selectElements.length;
					//第一次点击，判断是否周围有方块，有则放在selectElements中
					if(length==0)
					{
						this.judge(x,y);
						if(selectElements.length>0)
						{
							this.select();
						}
					}
					
					if(length>0)
					{
						if(selectElements[y+"_"+x])//第二次点击,判断是否点击的已经选择了的方块，如果点击的已经选择了方块，则已选择的方块缩小消失
						{
							isOnControl=false;
							game.setScore(selectElements.length);
							this.selectDele();
						}
						else//第二次点击，没有点击已经选择方块，则选择其它方块
						{
							this.unselect();
							this.addElement(x,y);
						}
					}
				}
			});
			
			return JudgeSelect;
		}(inherit,modify);

		

		//这里是canvas游戏模块
		var canvasGame=function(Shape,eventUntil,Judge){
			var canvasGame=Shape;//canvasGame继承于shape类，为了将shape类抛出，但是只能有一个模块，所以将实物模块挂载到canvasGame上
			canvasGame.Game=function(canvasId,guanka,score,destination,highScore,fontCanvas){
				this.canvas=document.getElementById(canvasId);//取得canvas
				this.fontCanvas=document.getElementById(fontCanvas);
				this.context=this.canvas?this.canvas.getContext("2d"):null;//取得context
				this.width=this.canvas.width;
				this.height=this.canvas.height;
				this.elements=this.elementsInit();//canvas内所有的实物对象
				this.map=this.elementsInit();
				this.offsetLeft=this.canvas.offsetLeft;
				this.offsetTop=this.canvas.offsetTop;

				Shape.publicMethod.addHander("draw",this.paint.bind(this));//每当实例化一个游戏对象，就将游戏对象的paint方法传进去,由于光传进去函数表达式还不行，因为这个表达式必须绑定在本游戏对象上
				Shape.publicMethod=null;//这个方法是框架内部方法，不希望被外部看到。

				this.guanka=1;
				this.score=0;
				this.destination=1000;
				this.guankaNode=document.getElementById(guanka);
				this.scoreNode=document.getElementById(score);
				this.destinationNode=document.getElementById(destination);
				this.highScoreNode=document.getElementById(highScore);
			}
			canvasGame.Game.prototype={
				constructor:canvasGame.Game,
				setGuanka:function(guanka){
					var guanka=guanka||this.guanka,
						destination;
					this.guanka=guanka;
					if(guanka<=9)
					{
						destination=1000+(guanka-1)*2000;
						if(destination===5000||destination===19000||destination===12000)
						{
							destination+=1000;
						}
					}
					else{
						destination=24000+4000*(guanka-10);
					}
					this.destination=destination;
					this.guankaNode.innerHTML=guanka;
					this.destinationNode.innerHTML=destination;
				},
				setScore:function(count){//设置分数
					var startScore=this.score;
					this.score+=5*count*count;
					var endScore=this.score,
						scoreNode=this.scoreNode;
					var timer=setInterval(function(){
						startScore+=5;
						scoreNode.innerHTML=startScore;
						if(startScore===endScore)
						{
							clearInterval(timer);
						}
					},10);
				},
				setEndScore:function(count){//设置末尾分数
					var endScore=[2000,1980,1920,1820,1680,1500,1280,1020,720,380],
						score=count>endScore.length-1?0:endScore[count],
						startScore=this.score,
						endScore,
						scoreNode=this.scoreNode,
						timer;
					this.score+=score;
					endScore=this.score,
					scoreNode.innerHTML=endScore;
				},
				setHighScore:function(){
					var highScore=localStorage["highScore"]||0;
					this.highScoreNode.innerHTML=highScore;
					if(this.score>=highScore)
					{
						this.highScoreNode.innerHTML=this.score;
						localStorage["highScore"]=this.score;
					}
				},
				getHighScore:function(){
					return localStorage["highScore"]||0;
				},
				judgeIfNext:function(){
					if(this.score>=this.destination){
						this.nextGuan();
					}
					else{
						this.gameOver();
					}
				},
				nextGuan:function(){
					var nextGuanka=++this.guanka;
					this.setGuanka(nextGuanka);
					this.initDraw();
				},
				gameOver:function(){
					this.setHighScore();
					alert("游戏结束,即将从头开始！");
					this.score=0;
					this.setGuanka(1);
					this.initDraw();
				},
				elementsInit:function(){
					var arr=[];
					for(var i=0;i<10;i++)
					{
						arr[i]=[];
					}
					return arr;
				},
				paint:function(){
					var elements=this.elements,
		            	context=this.context;
					context.clearRect(0,0,this.width,this.height);
					var cellCount=elements[0].length;
					var rowCount=elements.length;
					
					for(var i=rowCount-1;i>=0;i--)
				    {
						for (var j = cellCount-1; j >=0; j--) {
							elements[i][j]&&elements[i][j].draw();
						}
		            }
				},
				noPaint:function(){
					var context=this.context;
					context.clearRect(0,0,this.width,this.height);
				},
				addElement:function(x,y,ele){
					this.elements[y][x]=ele;
				},
				selectHandler:function(){
					this.select=new Judge(this.map,this.elements);//用来处理选择了的方块
				},
				addEvent:function(){
					this.selectHandler();
					var _this=this;
					this.canvas.addEventListener("mousedown",function(ev){
						if(isOnControl)
						{
							ev=eventUntil.getEvent(ev);
							eventUntil.preventDefault(ev);
							var ev=eventUntil.getFullEvent(this.offsetLeft,this.offsetTop,ev);
							var elements=this.elements;
							var X=Math.floor(ev.X/27);//x,y坐标
							var Y=Math.floor(ev.Y/27);
							_this.select.addElement(X,Y);
						}
					});
				},
				createArr:function (){
					var arr=[];
					for (var i = 0; i < 10; i++) {
						var subArr=[];
						for (var j = 0; j < 10; j++) {
							subArr[j]=Math.ceil(Math.random()*5);
						};
						arr.push(subArr);
					};
					return arr;
				},
				twinkle:function(fn){//闪烁
					var i=0;
					function tw(){
						i++;
						if(i%2===1)
						{
							this.paint();
						}
						else{
							this.noPaint();
						}
						if(i<5)
						{
							setTimeout(tw.bind(this),300);
						}
						else{
							fn();
						}
					}
					setTimeout(tw.bind(this),300);
				},
				initDraw:function(){
					var arr=this.createArr(),
						map=this.map;
					var context=this.context;
					for (var i = 0; i < 10; i++) {
						for (var j = 0; j < 10; j++) {
							map[i][j]=arr[i][j];
							this.addElement(j,i,new canvasGame.Img(j,i,arr[i][j],context));
						};
					};
					this.paint();
				},
				initData:function(){
					this.setGuanka(1);
					this.setHighScore();
				},
				start:function(){
					this.initDraw();
					this.initData();
					this.addEvent();
					StarAnimation.addCanvas(this.fontCanvas);
					game=this;
				}
			}

			return canvasGame;
		}(Shape,eventUntil,Judge);

		

		window.PopStar=canvasGame;
	})(window);
	var game=new PopStar.Game("canvas1","guankaC","scoreC","destinationC","bestScoreC","fontCanvas");
	game.start();