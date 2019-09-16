//对象属性法创建酷
/*

var base= {
		getid:function(id){
			return	document.getElementById(id);
		},
		gettagname:function(name){
			return document.getElementsByTagName(name);
		},
		getclass:function(classname) {
			return document.getElementsByClassName(classname);
		}
	};


*/	


/*

//函数连缀js库........................................................................................................

*/	
var J= function (args) {
	return new Base(args);
}
//基础库	
function Base(args) {
	//把返回的节点对象保存到一个 Base 对象的属性数组里
	this.elements=[];
	if(typeof args == 'string'){
		//CSS模拟
		if(args.indexOf(' ') != -1){
			var elements=args.split(' '); //把节点分拆保存起来
			var childElements=[];  //存放临时节点对象的数组
			var node=[];           //用来存放父节点使用 
			for(var i=0;i<elements.length;i++){
				if (node.length == 0) node.push(document);		//如果默认没有父节点，就把document放入
				switch(elements[i].charAt(0)){
					case'#':
						childElements=[];  //清理掉临时节点让父节点失效  子节点生效
						childElements.push(this.getId(elements[i].substring(1)));
						node = childElements;
					break;
					case'.':
						childElements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getClass(elements[i].substring(1),node[j]);
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k]);
							}
						}	
						node=childElements;
					break;
					default:
						childElements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getTagName(elements[i],node[j]);
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k]);
							}
						}	
						node=childElements;
				}
			}
			this.elements=childElements;
		}else{
			//find模拟
			switch(args.charAt(0)){
				case'#':
					this.elements.push(this.getId(args.substring(1)));
				break;
				case'.':
					this.elements = this.getClass(args.substring(1));
				break;
				default:
					this.elements = this.getTagName(args);
				
			}
		}
		
		
	}else if(typeof args == 'object'){
		if(args != undefined){
			this.elements[0]=args;
		}
	}else if(typeof args == 'function'){
		addDomLoaded(args);
	}
	
	
}

//使用J对象调用DOM加载
Base.prototype.ready=function(fn){
	addDomLoaded(fn);
}


//节点选择器仿CSS选择器........................................................................................................


//获取元素ID
Base.prototype.getId=function (id) {
	return document.getElementById(id);
};

//获取元素节点数组
Base.prototype.getTagName = function (tag, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for (var i = 0; i < tags.length; i ++) {
		temps.push(tags[i]);
	}
	return temps;
};

		
//获取CLASS节点数组
Base.prototype.getClass = function (className, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for (var i = 0; i < all.length; i ++) {
		//if (all[i].className == className )(
		if((RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className)) {
			temps.push(all[i]);
		}
	}
	return temps;
}

//子选择器

Base.prototype.find=function(str){
	childElements=[];
	for ( var i=0; i < this.elements.length; i++ ) {
		switch(str.charAt(0)){
			case'#':
				childElements=childElements.push(this.getId(str.substring(1)));
			break;
			case'.':
				var temps = this.getClass(str.substring(1), this.elements[i]);
				for (var j = 0; j < temps.length; j ++) {
					childElements.push(temps[j]);
				}
			break;
			default:
				var temps = this.getTagName(str, this.elements[i]);
				for (var j = 0; j < temps.length; j ++) {
					childElements.push(temps[j]);
				}
		}
	}
	this.elements=childElements;
	return this;
}

//获取HTMLDOM对象........................................................................................................

//获取元素ID
Base.prototype.get_Id=function (id) {
	this.elements.push(document.getElementById(id));
	return this;
};

//获取元素class
Base.prototype.get_Class=function (className,idName) {
	var node=null;
	if(arguments.length==2){
		node=document.getElementById('idName');
	}else{
		node=document;
	}
	var allclass=node.getElementsByTagName('*')
	for ( var i=0; i < allclass.length; i++ ) {
		if(allclass[i].className==className) {
			this.elements.push(allclass[i]);
		}
		
	}
	return this;
}

//获取元素标签名
Base.prototype.get_TagName=function (tagname) {
	var tags=document.getElementsByTagName(tagname);
	for (var i=0;i<tags.length;i++) {
		this.elements.push(tags[i]);
	}
	return this;
};

//获取元素属性name值
Base.prototype.getName=function (name) {
	var names=document.getElementsByName(name);
	for (var i=0;i<names.length;i++) {
		this.elements.push(names[i]);
	}
	return this;
};

//增加Class
Base.prototype.addClass=function(className) {
	for (var i=0;i<this.elements.length;i++) {
		if(!this.elements[i].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))){
			this.elements[i].className +=" "+className;
		}
		
	}
	return this;
}
//removeClass
Base.prototype.removeClass=function(className) {
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className.match(new RegExp('(\\s|^)'+className+'(\\s)'))) {
			this.elements[i].className=this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s)'),' ')
		}
	}
}




//样式改变........................................................................................................
 
//更改元素css样式
Base.prototype.css=function (attr,value) {
	for (var i=0;i<this.elements.length;i++) {
		if(arguments.length==1){
			if(typeof window.getComputedStyle!='undefined') { //w3c标准 获取外联样式
				return window.getComputedStyle(this.elements[i],null)[attr];
			}else if(typeof this.elements[i].currentStyle!='undefined') {//IE标准
				return this.elements[i].currentStyle[attr];
			}
		}
		this.elements[i].style[attr]=value;
	}
	return this;
}
//替换元素节点内容
Base.prototype.html=function (value) {
	for (var i=0;i<this.elements.length;i++) {
		if (arguments.length==0) {
			return this.elements[i].innerHTML;
		}else {
			this.elements[i].innerHTML=value;
		}
		
	}
	return this;
}
//获取元素节点文本内容
Base.prototype.text=function (str) {
	for (var i=0;i<this.elements.length;i++) {
		if (arguments.length==0) {
			return (typeof this.elements[i].textContent=='string') ? this.elements[i].textContent : this.elements[i].innerText;
			
		}
		if(typeof this.elements[i].textContent == 'string') {
			this.elements[i].textContent=str;
		}else{
			this.elements[i].innerText=str;
		}
		
		
	}
	return this;
}
//获取元素属性
Base.prototype.attr=function(attr,value){
	for (var i = 0; i < this.elements.length; i ++) {
		if(arguments.length==1){
			return this.elements[i].getAttribute(attr);
		}else if(arguments.length==2){
			this.elements[i].setAttribute(attr,value);
		}
	
	}
	return this;
}
//获取某一个节点在整个节点中的第几个索引
Base.prototype.index = function(){
	var children = this.elements[0].parentNode.children;
	for(var i=0;i<children.length;i++){
		if(this.elements[0]==children[i])return i;
	}
}
//筛选得到元素节点第一个,返回DOM元素本身；
Base.prototype.length = function () {
	return this.elements.length;
};
//筛选得到元素节点第一个,返回DOM元素本身；
Base.prototype.first = function () {
	return this.elements[0];
};

//筛选得到元素节点最后一个,返回DOM元素本身；
Base.prototype.last=function (num) {
	return this.elements[this.elements.length-1];
}
//筛选得到元素节点其中的一个,返回DOM元素本身；
Base.prototype.ej=function (num) {
	return this.elements[num];
}

//筛选得到元素节点其中的一个,返回Base；
Base.prototype.eq=function (num) {
	var element=this.elements[num];
	this.elements=[];
	this.elements[0]=element;
	return this;
}

//获取元素ID下所有元素
Base.prototype.getIdTag=function (id,tag) {
	var node=null;
	if(arguments.length==2) {
		node=document.getElementById(id);
	}else {
		node=document;
	}
	var all=node.getElementsByTagName(tag);
}
//获取当前元素的下一个节点
Base.prototype.next=function(){
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].nextSibling;
		if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
		if (this.elements[i].nodeType == 3) this.next();
	}
	return this;
}

//获取当前元素的上一个节点
Base.prototype.prev=function(){
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].previousSibling;
		if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
		if (this.elements[i].nodeType == 3) this.prev();
	}
	return this;
}
//获取当前元素的上一个节点
Base.prototype.opacity=function(value){
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.opacity = value/100;
		this.elements[i].style.filter = 'alpha(opacity='+value+')';
	}
	return this;
}

//在构造函数上追加方法........................................................................................................
//设置表单字段元素
Base.prototype.form = function (name) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i][name];
	}
	return this;
};

//设置表单字段内容获取
Base.prototype.value = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].value;
		}
		this.elements[i].value = str;
	}
	return this;
}

//增加事件
Base.prototype.bind = function (event, fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		addEvent(this.elements[i], event, fn);
	}
	return this;
};
//增加点击事件
Base.prototype.click=function (fn) {
	for (var i=0;i<this.elements.length;i++) {
		addEvent(this.elements[i],'click',fn); // 现代事件绑定
		//this.elements[i].onclick=fn;  传统事件绑定方法
	}
	return this;
}
//增加进入事件
Base.prototype.mouseover=function (fn) {
	for (var i=0;i<this.elements.length;i++) {
		addEvent(this.elements[i],mouseover,fn);
	}
	return this;
}
//增加移出事件
Base.prototype.mouseout=function (fn) {
	for (var i=0;i<this.elements.length;i++) {
		addEvent(this.elements[i],mouseout,fn);
	}
	return this;
}
 //增加手表移入移除事件
 Base.prototype.hover=function(over,out) {
	 for(var i=0;i<this.elements.length;i++) {
		 addEvent(this.elements[i],'mouseover',over);
		 addEvent(this.elements[i],'mouseout',out);
	 }
	 return this;
 }
 
 
//点击切换方法
Base.prototype.toggle=function(){
	 for(var i=0;i<this.elements.length;i++) {
		 tog(this.elements[i],arguments);
	 }
	 return this;	 
}
//点击切换方法
function tog(element,args){
	 var count = 0;
	 addEvent(element,'click',function(){
		 args[count++ % args.length].call(this);
		 //count++;
		// if(count>=args.length) count = 0;
	 });
	 return this;	 
}
 
 //小功能封装........................................................................................................

//设置显示
Base.prototype.show=function() {
	for(var i=0;i<this.elements.length;i++) {
		this.elements[i].style.display='block';
	}
}

//设置隐藏
Base.prototype.hide=function() {
	for(var i=0;i<this.elements.length;i++) {
		this.elements[i].style.display='none';
	}
}


//窗口改变函数
Base.prototype.resize=function (fn) {
	addEvent(window,'resize',fn);
	return this;
}
//动画初探........................................................................................................
Base.prototype.animate=function(obj){
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : 
					   obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' : 
					   obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';

		var start = obj['start'] != undefined ? obj['start'] : 
						attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 : 
												   parseInt(getStyle(element, attr));
		var t = obj['t'] != undefined ? obj['t'] : 10;												//可选，默认10毫秒执行一次
		var step = obj['step'] != undefined ? obj['step'] : 20;								//可选，每次运行10像素
		var alter = obj['alter'];
		var target = obj['target'];
		var speed = obj['speed'] != undefined ? obj['speed'] : 20;							//可选，默认缓冲速度为6
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';		//可选，0表示匀速，1表示缓冲，默认缓冲
		var mul = obj['mul'];
		
		if (alter != undefined && target == undefined) {
			target = alter + start;
		} else if (alter == undefined && target == undefined && mul==undefined) {
			throw new Error('alter增量或target目标量必须传一个！');
		}
		if (start > target) step = -step;
		
		if (attr == 'opacity') {
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(start) +')';
		} 
		else {
			//element.style[attr] = start + 'px';
		}
		
		
		if(mul==undefined){
			var mul={};
			mul[attr]=target;
		}
		clearInterval(element.timer);
		element.timer = setInterval(function () {
			var flag = true ; //创建一个布尔值表示执行完毕  
			for(var i in mul){
				attr= i == 'x' ? 'left' : i == 'y' ? 'top' : 
					   i == 'w' ? 'width' : i == 'h' ? 'height' : 
					   i == 'o' ? 'opacity' : i != undefined ? i : 'left';
				target=mul[i];
			
				if (type == 'buffer') {
					step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed :
														 (target - parseInt(getStyle(element, attr))) / speed;
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}

				if (attr == 'opacity') {
					if (step == 0) {
						setOpacity();
					} else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
						setOpacity();
					} else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
						setOpacity();
					} else {
						var temp = parseFloat(getStyle(element, attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
					}
					if(parseInt(target) != parseInt(parseFloat(getStyle(element, attr))*100)) flag = false;
				} else {
					if (step == 0) {
						setTarget();
					} else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
						setTarget();
					} else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
						setTarget();
					} else {
						element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
					}
					if(parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
				}
			}
			//document.getElementById('aaa').innerHTML += step + '<br />';
			
			if( flag == true){
				clearInterval(element.timer);
				if (obj.fn != undefined) obj.fn();
			}
		}, t);
		
		function setTarget() {
			element.style[attr] = target + 'px';
		}
		
		function setOpacity() {
			element.style.opacity = parseInt(target) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';	
		}
	}
	return this;
}

/*延迟加载 start*/

/*延迟加载 end*/

/**/
/*插件封装
//设置居中
Base.prototype.center=function () {

}
//拖拽功能
Base.prototype.drag=function() {
}

*/
//插件入口
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
}

































/*可以更简单
//设置居中
Base.prototype.center=function () {
	for (var i=0;i<this.elements.length;i++) {
		
		this.elements[i].addEventListener('click',function(){
			alert(typeof this);
			alert(this.offsetHeight);
		});
			
		
			
		if(typeof window.getComputedStyle!='undefined') { //w3c标准 获取外联样式
			var thisHeight=window.getComputedStyle(this.elements[i],null)['height'];
			var thisWidth=window.getComputedStyle(this.elements[i],null)['width'];
			var height=thisHeight.substring(0,thisHeight.length-2);
			var width=thisWidth.substring(0,thisWidth.length-2);
			//var Top=(document.documentElement.clientHeight-height)/2
			var Top=(getinner().height-height)/2  //兼容IE8
			var Left=(getinner().width-width)/2
			
			this.elements[i].style.top=Top+'px';
			this.elements[i].style.left=Left+'px';
		}else if(typeof this.elements[i].currentStyle!='undefined') {//IE标准
			var thisHeight=this.elements[i].currentStyle['height'];
			var thisWidth=this.elements[i].currentStyle['width'];
			var height=thisHeight.substring(0,thisHeight.length-2);
			var width=thisWidth.substring(0,thisWidth.length-2);
			var Top=(getinner().height-height)/2  //兼容IE8
			var Left=(getinner().width-width)/2
			
			this.elements[i].style.top=Top+'px';
			this.elements[i].style.left=Left+'px';
		}
	}
	return this;
}*/

