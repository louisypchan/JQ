def(["qun.lang.Object","qun.lang.Util","qun.lang.View"], function(Object, Util, View){
	
	var controller =  declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.ViewController",
		
		"@synthesize" : ["view"],	
		
		"self" : function(layer){
			this.configuration = {};
			if(qun.Utils.isString(layer)){
				this.configuration = { id :  layer};
			}else if(layer !== undefined && layer !== null){
				this.configuration = layer;
			}
			this.id = this.configuration.id || qun.Utils.uniqueId();
			this._view = null;
			this._title = "";
			this._navigationItem = null;
			this._toolbarItems = [];
			this.outlets = {};
			this.keyframe = {
				wasBack : 	Util.TRANSITION.IN_FROM_LEFT,
				pushToBack : Util.TRANSITION.OUT_TO_LEFT,
				wasTop : Util.TRANSITION.OUT_TO_RIGHT,
				popToToP : Util.TRANSITION.IN_FROM_RIGHT
			};
			this.toBeVisible = Util.TRANSITION.FADE_IN;
			this.toBeHidden = Util.TRANSITION.FADE_OUT;
			
			//
			this.viewLoadingDelaysTransition = true;
			
			
		},
		
		getView : function(){
			return this._view ? this._view : this.loadView();
		},
		
		setView : function(view){
			
		},
		
		loadView : function(){
			this.view = new View();
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