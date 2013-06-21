def(["qun.lang.Object","qun.lang.Util","qun.lang.View"], function(Object, Util, View){
	
	var controller =  declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.ViewController",
		
		"@synthesize" : ["view", "title", "contentView"],	
		
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
			//
			this.viewWasArchived = this.viewIsLoaded = false;
		},
		//
		getView : function(){
			/*if(this._view) return this._view;
			if(this.viewWasArchived){
				
			}*/
			return this._view ? this._view : this.loadView();
		},
		
		setView : function(view){
			this._view instanceof View && delete this._view._viewController;
			if(view == null){
				//unload view
			}else{
				view._viewController = this;
				this._view = view;
			}
		},
		
		loadView : function(){
			this.view = new View();
		},
		
		unloadView : function(){
			
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