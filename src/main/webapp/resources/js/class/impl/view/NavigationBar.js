def(["qun.lang.View","qun.lang.Util"], function(View, Util){
	
	return declare({
		"@superclass" : View,
		"@name" : "qun.impl.view.NavigationBar",
		"@synthesize" : ["items"],
		
		"+baseCSSClass" : "jqmNavigationBar",
		
		"self" : function(layer){
			
		}
	});
});