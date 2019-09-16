//函数库封装

// 跨浏览器事件绑定(兼容IE8)........................................................................................................

/*实现累加，并指出是给addEvent函数使用的；
	JS皆为对象，adddEvent语法正确（对象形式调用）
*/
function addEvent(obj,type,fn) {
	if(typeof obj.addEventListener!='undefined'){
		obj.addEventListener(type,fn,false);
	}else{
		//创建一个函数使用的哈希表（散列表）
		if(!obj.events)obj.events={};
		//第一次执行时
		if(!obj.events[type]) {
			//创建一个存储函数处理的数组
			obj.events[type]=[];
			//把第一个事件处理先储存到第一个位置上
			if(obj['on'+type]) obj.events[type][0]=fn;
		}else{
			//同一个函数进行屏蔽不添加到计数器中
			if(addEvent.equal(obj.events[type],fn)) return false;
		}
		//从第二次开始使用事件计数器
		obj.events[type][addEvent.ID++]=fn;
		//执行事件处理函数
		obj['on'+type]=addEvent.handle;
	}
	
}
//为每一个事件添加一个计数器，
addEvent.ID=1;
//执行函数处理事件
addEvent.handle=function(event) {
	var e=event||addEvent.fixEvent(window.event);
	var es=this.events[e.type];
	for(var i in es ){
		es[i].call(this,e);
	}
}
//同一个函数进行屏蔽
addEvent.equal=function(es,fn){
	for(var i in es){
		if(es[i]==fn) return true;
	}
	return false;
}
// 跨浏览器事件移除
function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener != 'undefined') {
		 obj.removeEventListener(type,fn,false);
	}else{
		if(obj.events){
			for(var i in obj.events[type]){
				if(obj.events[type][i]==fn){
					delete obj.events[type][i];
				}
			}
		}
	}
	
}


//把IE常用的Event对象匹配的W3C中
addEvent.fixEvent=function(event){
	event.preventDefault=addEvent.fixEvent.preventDefault;
	event.stopPropagation=addEvent.fixEvent.stopPropagation;
	event.target=event.srcElement;
	return event;
}
//IE阻止默认行为
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
};
//IE取消冒泡
addEvent.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};

//浏览器检测........................................................................................................

(function () {
	window.sys = {};
	var ua = navigator.userAgent.toLowerCase();	
	var s;		
	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] : 
	(s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] : 
	(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
	
	if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载........................................................................................................

function addDomLoaded(fn) {
	var isReady = false;
	var timer = null;
	function doReady() {
		if (timer) clearInterval(timer);
		if (isReady) return;
		isReady = true;
		fn();
	}
	
	if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
		//无论采用哪种，基本上用不着了
		/*timer = setInterval(function () {
			if (/loaded|complete/.test(document.readyState)) { 	//loaded是部分加载，有可能只是DOM加载完毕，complete是完全加载，类似于onload
				doReady();
			}
		}, 1);*/

		timer = setInterval(function () {
			if (document && document.getElementById && document.getElementsByTagName && document.body) {
				doReady();
			}
		}, 1);
	} else if (document.addEventListener) {//W3C
		addEvent(document, 'DOMContentLoaded', function () {
			fn();
			removeEvent(document, 'DOMContentLoaded', arguments.callee);
		});
	} else if (sys.ie && sys.ie < 9){
		var timer = null;
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left');
				doReady();
			} catch (e) {};
		}, 1);
	}
}
//跨浏览器视窗大小 兼容IE8........................................................................................................
function getinner() {
	if(window.innerWidth!=undefined){
		return {
			width:innerWidth,
			height:innerHeight
		}
	}else{
		return {
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
}
// 跨浏览器获取innerTxet
/*function getInnerText(element){
	return (typeof element.textContent=='string') ? element.textContent : element.innerText;
}*/
// 跨浏览器设置innerTxet
function getInnerText(element,str){
	if(typeof element.textContent == 'string') {
		element.textContent=str;
	}else{
		element.innerText=str;
	}
}



//获取滚动条距离顶部的高度
function getScroll(){
	return {
		top : document.documentElement.scrollTop || document.body.scrollTop,
		left : document.documentElement.scrollLeft || document.body.scrollLeft
	}
}

//获取元素相对父元素顶端的位置  如果父元素没有定位  则获取相对body高度
function offsetTop(element){
	var top = element.offsetTop;
	var parent = element.offsetParent
	while(parent!=null){
		top += parent.offsetTop;
		parent=parent.offsetParent;
	}
	return top;
}
//获取元素样式..................................................................................................................
function getStyle(element,attr) {
	var value;
	
	if(typeof window.getComputedStyle!='undefined') { //w3c标准 获取外联样式
		value = window.getComputedStyle(element,null)[attr];
	}else if(typeof element.currentStyle!='undefined') {//IE标准
		value = element.currentStyle[attr];
	}
	return value;
}
//正则去掉左右空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

//获取Event对象 兼容IE8........................................................................................................
function getEvent(event){
	return event||window.event;
}

//阻止默认行为........................................................................................................
function predef(event) {
	var e=getEvent(e);
	if(typeof e.preventDefault!='undefined'){//W3c
		e.preventDefault();
	}else{//IE
		e.returnValue=false;
	}
}
// 判断所传值在不在此数组中
	function inArray(array,value){
		for(var i in array){
			if(array[i]===value)return true;
		}
		return false;
	}

//AJAX........................................................................................................

/*function creatXHR() { //ajax得核心对象XHR
	if(typeof XMLHttpRequest!='undefined'){
		return new XMLHttpRequest();
	}else if(typeof ActiveXObjext!='undefined'){  //兼容IE6
		var vesion=[
			'MSXML2.XMLHttp.6.0',
			'MSXML2.XMLHttp.3.0',
			'MSXML2.XMLHttp'
		]
		for (var i=0;i<vesion.length;i++){
			try{
				return new ActiveXObjext(vesion[i]);
			}catch(e){
				
			}
		}
	}else {
		throw new Error('您的浏览器不支持XHR对象');
	}
	return 
}
*/
//封装ajax
function ajax(obj) {
	var xhr = (function () {
		if (typeof XMLHttpRequest != 'undefined') {
			return new XMLHttpRequest();
		} else if (typeof ActiveXObject != 'undefined') {
			var version = [
										'MSXML2.XMLHttp.6.0',
										'MSXML2.XMLHttp.3.0',
										'MSXML2.XMLHttp'
			];
			for (var i = 0; version.length; i ++) {
				try {
					return new ActiveXObject(version[i]);
				} catch (e) {
					//跳过
				}	
			}
		} else {
			throw new Error('您的系统或浏览器不支持XHR对象！');
		}
	})();
	obj.url = obj.url + '?rand=' + Math.random();
	obj.data = (function (data) {
		var arr = [];
		for (var i in data) {
			arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
		}
		return arr.join('&');
	})(obj.data);
	if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
	if (obj.async === true) {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				callback();
			}
		};
	}
	xhr.open(obj.method, obj.url, obj.async);
	if (obj.method === 'post') {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(obj.data);	
	} else {
		xhr.send(null);
	}
	if (obj.async === false) {
		callback();
	}
	function callback() {
		if (xhr.status == 200) {
			obj.success(xhr.responseText);			//回调传递参数
		} else {
			alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
		}	
	}
}