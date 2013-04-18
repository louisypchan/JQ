def(["qun.lang.Object",
     "qun.lang.Util",
     "qun.lang.Point",
     "qun.lang.Size"], function(Object, Util, Point, Size){
	
	return declare({
		"@superclass" : Object,
		
		"@name" : "qun.lang.View",
		
		"@synthesize" : ["id","zIndex","opacity","size","position", "clipsToBounds", "doubleSided", "hidden", "transform"],
		
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
			this._position = new Point();
			this._size = new Size();
			this._zIndex = 0;
			this._opacity = 1;
			this._transform = "none";
			this._doubleSided = true; //refer to -webkit-backface-visibility : visible
			this._hidden = this._clipsToBounds = false;
			this._layerIsInDocument = false;
			this._declarativeBacking = false;
			
			this.gestureRecognizers = []; //TODO
			
			if(layer instanceof Element){
				if(document.body.contains(this.layer)){
					//#TODO
					if(this._declarativeBacking){
						this.parseViewsInLayer();
					}
					this._layerIsInDocument = true;
					this.readLayersProps(this.layer);
				}
			}else if(this.layer === undefined){
				this.createLayer();
				this.setupLayerCSS();
				this.layerWasCreated();				
			}
			this.layer._view = this;
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
		
		readLayersProps : function(layer){
			var computedStyle = window.getComputedStyle(layer);
			this._size.width = parseInt(computedStyle.width, 10)||0;
			this._size.height = parseInt(computedStyle.height, 10)||0;
			this._position.x = parseInt(computedStyle.left, 10)||0;
			this._position.y = parseInt(computedStyle.top, 10)||0;
			this._zIndex = parseInt(computedStyle.zIndex, 10)||0;
			this._clipsToBounds = computedStyle.overflow === "hidden";
			this._doubleSided = computedStyle.webkitBackfaceVisibility === "visible";
			this._hidden = (computedStyle.display === "none" || computedStyle.visibility === "hidden");
			this._opacity = parseFloat(computedStyle.opacity);
			this._transform = computedStyle.webkitTransform;
			
		},
		
		parseViewsInLayer : function(){
			
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