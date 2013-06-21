def(["qun.lang.View",
	"qun.lang.Util",
	"qun.lang.Size"], function(View, Util,Size){
	
	return declare({
		"@superclass" : View,
		"@name" : "qun.impl.view.NavigationBar",
		"@synthesize" : ["items", "topItem", "backItem", "busy"],
		
		"+baseCSSClass" : "jqmNavigationBar",
		
		"self" : function(layer){
			this.delegate = null;
			this._barStyle = null;
			this._items = [];
			this._busy = false;
		},
		
		setSize : function(size){
			this.callSuper(new Size(size.width, Util.NavBar_PROPS.DEFAULT_HEIGHT));
		}
	});
});