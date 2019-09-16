
J().extend('center',function(){
	for (var i=0;i<this.elements.length;i++) {
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
});


