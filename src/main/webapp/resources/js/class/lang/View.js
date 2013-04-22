def(["qun.lang.Object",
     "qun.lang.Util",
     "qun.lang.Point",
     "qun.lang.Size"], function(Object, Util, Point, Size){

	return declare({
		"@superclass" : Object,

		"@name" : "qun.lang.View",

		"@synthesize" : ["id","zIndex","opacity","size","position", "anchorPoint", "anchorPointZ", "clipsToBounds", "doubleSided", "hidden", "transform"],

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
			this.autoresizeBacking = true; // will auto reisze all the subviews when the superview is changed
			this._position = new Point();
			this._size = new Size();
			this._anchorPoint = new Point(0.5, 0.5);
			this._zIndex = 0;
			this._opacity = 1;
			this._transform = "none";
			this._doubleSided = true; //refer to -webkit-backface-visibility : visible
			this._hidden = this._clipsToBounds = false;
			this._layerIsInDocument = false;
			this._declarativeBacking = false;
			this._transitionEnabled = this._wantsAccelerometerBacking = false;
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
			
			this.addObserver("subViewsIndexInSuperView", this, "subViewsIndexChanged");
			this.addObserver("layerStyle", this, "layerStyleChanged");
			this.addObserver("anchorPoint", this, "updateTransformOrgin");
		},

		/**
		 * Create a dive layer if the passed layer is not an Element
		 */
		createLayer : function(){
			this.layer = document.createElement("div");
		},
		/**
		 * Setup the className
		 */
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
		 * Read the props from computedStyle
		 */
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
			var transformMatrix = Util.matrixFromString(this._transform);
			if(!Util.matrixEqualsToMatrix(transformMatrix, new WebKitCSSMatrix)){
				this._position.x += transformMatrix.m41;
				this._position.y += transformMatrix.m42;
				transformMatrix = transformMatrix.translate(transformMatrix.m41 * -1, transformMatrix.m42 * -1, 0);
				this._transform = transformMatrix.toString();

			}
			transformMatrix = null;
			if(this._transform != "none"){
				//trun on webkit supportive
				this._wantsAccelerometerBacking = true;
			}
		},
		/**
		 * 
		 */
		parseViewsInLayer : function(){
			//TODO:
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
		/**
		 * add subview
		 */
		addSubView : function(view){
			this.insertSubViewAtIndex(view, this.subviews.length);
		},
		/**
		 * remove subview
		 */
		removeSubView : function(view){
			if(view.superview == this){
				//interface open
				this.willRemoveSubView(view);
				var subviews = this.subviews, viewIndex = view._viewIndexInSuperView;
				subviews.splice(viewIndex, 1);
				this.notifyPropChange("subViewsIndexInSuperView", [viewIndex]);
			}
		},
		/**
		 * add subview according to the index passed in
		 */
		insertSubViewAtIndex : function(view, index){
			var subViews = this.subviews, subview;
			if(index < subViews.length){
				var superview = view.superview, _viewIndex = null;
				if(superview == this){
					_viewIndex = view._viewIndexInSuperView;
					if(index === _viewIndex) return;
					subViews.splice(_viewIndex, 1);
					index > _viewIndex && _viewIndex--;
				}else{
					superview && superview.removeSubView(view);
					view.willMoveToSuperview(this);
				}
				//insert view to subviews
				subViews.splice(index, 0, view);
				view._viewIndexInSuperView = index;
				_viewIndex = (_viewIndex != null && _viewIndex < index) ? _viewIndex : index + 1;
				this.notifyPropChange("subViewsIndexInSuperView", [_viewIndex]);
				//
				subview = this.subviews[index + 1];
				this.layer.insertBefore(view.layer, subview ? subview : null);
				if(superview != this){
					view.superview = this;
					view.didMoveToSuperview();
				}
				this.didAddSubView(view);
				this._layerIsInDocument && !view._layerIsInDocument && view.readLayersProps();
			}
		},
		
		setSize : function(size){
			if(size && !this._size.equals(size)){
				var currentSize = this._size.copy();
				this._size = size;
				this.notifyPropChange("layerStyle", [{width : size.width, height : size.height}]);
				this.autoresizeBacking && this.resizeSubViews(currentSize);
			}
		},
		/**
		 * 
		 */
		setAnchorPoint : function(anchorPoint){
			if(anchorPoint){
				this._anchorPoint = anchorPoint;
				this.notifyPropChange("anchorPoint");
			}
		},
		setAnchorPointZ : function(anchorPointZ){
			this._anchorPointZ = anchorPointZ;
			this.notifyPropChange("anchorPoint");
		},
		setDoubleSided : function(doubleSided){
			this._doubleSided = doubleSided;
			this.notifyPropChange("layerStyle", [{ "-webkit-backface-visibility" : doubleSided ? "visible" : "hidden"}]);
		},
		setZIndex : function(zIndex){
			this._zIndex = zIndex;
			this.notifyPropChange("layerStyle", [{ "z-index" : zIndex }]);			
		},
		setHidden : function(hidden){
			this._hidden = hidden;
			this.notifyPropChange("layerStyle", [{ "visibility" : hidden ? "hidden" : "visible", "display" : hidden ? "none" : "block"}]);
		},
		setClipsToBounds : function(clipsToBounds){
			this._clipsToBounds = clipsToBounds;
			this.notifyPropChange("layerStyle", [{ "overflow" : clipsToBounds ? "hidden" : "visible" }]);
		},
		setOpacity : function(opacity){
			this._opacity = opacity;
			this.notifyPropChange("layerStyle", [{ "opacity" : opacity }]);
		},
		setPosition : function(position){
			if(position && !this._position.equals(position)){
				this._position = position;
				this.updatePositionAndTransform();
			}
		},
		setTransform : function(transform){
			this._transform = transform;
			this.updatePositionAndTransform();
		},
		/**
		 * 
		 */
		resizeSubViews : function(size){
			//TODO:
		},
		subViewsIndexChanged : function(index){
			index = index || 0;
			for(var l = this.subviews.length; index < l; index++){
				this.subviews[index]._viewIndexInSuperView = index;
			}
		},
		layerStyleChanged : function(styles){
			for(var name in styles){
				this.layer.style.setProperty(name, styles[name]);
			}
		},
		updateTransformOrgin : function(){
			var x = this._anchorPoint.x * 100, y = this._anchorPoint.y * 100, z = this._anchorPointZ;
			this.notifyPropChange("layerStyle", [{
				 "-webkit-transform-origin" : Math.round(x) + "% " + Math.round(y) + "% "+ z + "px"
			}]);
		},
		willRemoveSubView : function(){},
		willMoveToSuperview : function(){},
		didMoveToSuperview : function(){},
		didAddSubView : function(){}
	});
});