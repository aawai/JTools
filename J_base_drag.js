//拖拽功能插件

J().extend('drag',function(){
	var tags=arguments;
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mousedown',function(e){
			var _this=this;
			var valueX=e.clientX-_this.offsetLeft;
			var valueY=e.clientY-_this.offsetTop;
			//自定义拖拽区域
			//e.target.class效果会不会更好
			flag = false;
			for(var i=0;i<tags.length;i++){
				if(e.target == tags[i]){
					flag = true;
					break;
				}
				
			}
			 
			if(flag){
				addEvent(document,'mousemove',move);
				addEvent(document,'mouseup',up);
			}else{
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}
			
			function move(e){
				var Top=e.clientY-valueY;
				var Left=e.clientX-valueX;
				if(Left<0){
					Left=0;
				}else if(Left>getinner().width-_this.offsetWidth){
					Left=getinner().width-_this.offsetWidth;
				}
				if(Top<0){
					Top=0;
				}else if(Top>getinner().height-_this.offsetHeight){
					Top=getinner().height-_this.offsetHeight;
				}
				
				_this.style.top=Top+'px';
				_this.style.left=Left+'px';
			}
			function up(){
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mousemove',up);
			}
		});
	}
	return this;
});
