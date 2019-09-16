//表单序列化功能插件
J().extend('serialize',function(){
	for(var i=0;i<this.elements.length;i++){
		var form=this.elements[i];
		var part = {};
		for(var i=0 ; i < form.elements.length ; i++){
			var filed=form.elements[i];
			switch(filed.type){
				case undefined:
				case 'submit':
				case 'reset':
				case 'button':
				break;
				case 'radio':
				case 'checkbox':
				if(!filed.selected)break;
				case 'select-one':
				case 'select-multiple':
				for(var j=0;j<filed.options.length;j++){
					var option=filed.options[i];
					if(option.selected){
						var optValue='';
						if(option.hasAttribute){
							optValue=(option.hasAttribute('value')?option.value:option.text);
						}else{
							optValue=(option.attributes('value').specified?option.value:option.text);
						}
						part[field.name]=optValue;
					}
				}
				default:
				part[filed.name]=filed.value;
			}
		}
		return part;	
	}
	return this;
});