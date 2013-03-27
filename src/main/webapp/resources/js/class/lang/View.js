def(["qun.lang.Object"], function(Object){
	
	return declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.View",
		
		"@synthesize" : ["id","zIndex","opacity"],
		
		"self" : function(/*String|DOMObject*/layer){
			this.callSuper();
			if(qun.Utils.isString(layer)){
				layer = document.querySelector(layer);
			}
			this.layer = layer;
			this.superview = null;
			this.subviews = [];
			this._zIndex = 0;
			this._opacity = 1;
			this._transitionsEnabled = false;
			//
			
		},
		
		getId : function(){
			
		},
		
		setId : function(){
			
		},
		
		addSubView : function(view){
			
		},
		
		removeSubView : function(view){
			
		}
	});
});