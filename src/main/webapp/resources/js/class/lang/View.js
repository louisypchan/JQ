def(["qun.lang.Object"], function(Object){
	
	return declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.View",
		
		"@synthesize" : ["id","zIndex","opacity"],
		
		"baseCSSClass" : "jqmView",
		
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
		
		
		createLayer : function(){
			this.layer = document.createElement("div");
		},
		/**
		 * 
		 */
		setupLayerCSS : function(){
			for(var meta = this._meta, cssClass; meta._meta;){
				//cssClass
			}
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