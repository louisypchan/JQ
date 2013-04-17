def(["qun.lang.View","qun.lang.Util"], function(View, Util){
	
	return declare({
		"@superclass" : View,
		"@name" : "qun.impl.NavigationBar",
		"@synthesize" : ["items"],
		
		"+baseCSSClass" : "jqm-navigation-bar",
		
		"self" : function(layer){
			this.delegate = null;
			this._items = [];
		}
	});
});