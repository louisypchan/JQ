def(["qun.lang.View",
	 "qun.lang.Util",
     "qun.lang.Size"], function(View, Util, Size){
	
	return declare({
		"@superclass" : View,
		"@name" : "qun.impl.view.RootView",
		"+baseCSSClass" : "jqmRootView",
		
		"self" : function(layer){
			if(this.layer === document.body){
				this._layerIsInDocument = true;
			}
			this.size = new Size(window.innerWidth, window.innerHeight);
			Util.removeClass(this.layer, View.baseCSSClass);
			return this;
		},
		
		//@override
		createLayer : function(){
			this.layer = document.body;
		}
	});
	
});