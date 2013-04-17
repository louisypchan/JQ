def(["qun.lang.Object","qun.lang.Util"], function(Object, Util){
	
	var controller =  declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.ViewController",
		
		"@synthesize" : ["view"],	
		
		"self" : function(){
			this.callSuper();
		},
		
		viewWillAppear : function(){
			
		},
		
		viewDidAppear : function(){
			
		},
		
		viewWillDisappear : function(){
			
		},
		
		viewDidDisappear : function(){
			
		},
		
		orientationDidChange : function(){
			
		}
	
	});
	
	return controller;
});