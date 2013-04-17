def(["qun.lang.Object","qun.lang.Util"], function(Object, Util){
	
	return declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.View",
		
		"@synthesize" : ["id","zIndex","opacity"],
		
		"+baseCSSClass" : "jqmView",
		
		"self" : function(/*String|DOMObject*/layer){
			this.callSuper();
			console.log(qun);
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
			this.createLayer();
			this.setupLayerCSS();
			this.layerWasCreated();
		},
		
		
		createLayer : function(){
			this.layer = document.createElement("div");
		},
		
		_setupLayerCSS : function(it){
			for(var cls; it;){
				cls = it.baseCSSClass;
				cls && Util.addClass(this.layer, cls);
				it = it._meta.super;
				if(qun.Utils.isArray(it)){
					for(var i = 0, l = it.length; i < l; i++){
						this._setupLayerCSS(it[i]);
					}
				}
			}
		},
		/**
		 * 
		 */
		setupLayerCSS : function(){
			this._setupLayerCSS(this._class);
		},
		
		layerWasCreated : function(){
			
		},
		getId : function(){
			return this.layer.id;
		},
		
		setId : function(viewId){
			this.layer.id = viewId;
		},
		
		addSubView : function(view){
			
		},
		
		removeSubView : function(view){
			
		},
		insertSubViewAtIndex : function(){
			
		}
	});
});