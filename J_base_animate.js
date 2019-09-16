/*
* Top Version1.0
* ================================================
* Email yaweija@gmail.com
* ================================================
* Author: seven
* Date: 2017年06月3日
*/
//动画插件
J().extend('animate',function(obj){
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : 
					   obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' : 
					   obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';

		var start = obj['start'] != undefined ? obj['start'] : 
						attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 : 
												   parseInt(getStyle(element, attr));
		var t = obj['t'] != undefined ? obj['t'] : 10;							//可选，默认10毫秒执行一次
		var step = obj['step'] != undefined ? obj['step'] : 20;					//可选，每次运行10像素
		var alter = obj['alter'];
		var target = obj['target'];
		var speed = obj['speed'] != undefined ? obj['speed'] : 20;				//可选，默认缓冲速度为6
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';//可选，0表示匀速，1表示缓冲，默认缓冲
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
		} else {
			element.style[attr] = start + 'px';
		}
		
		
		if(mul==undefined){
			var mul={};
			mul[attr]=target;
		}
		clearInterval(element.timer);
		element.timer = setInterval(function () {
			var flag = true ; //用于状态判断  
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
})