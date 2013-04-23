def(["qun.lang.Object",
     "qun.lang.View",
     "qun.lang.Util",
     "qun.lang.Point",
     "qun.lang.Size"], function(Object, View, Util, Point, Size){
	
	/**
	 * 
	 */
	return declare({
		"@superclass" : Object,
		"@name" : "qun.lang.Transition",
		
		"+DID_COMPLETE_DELEGATE" : "transitionCompleted",
		"+DEFAULTS" : {
			duration : 0.5,
			delay : 0,
			removeTargetUponCompletion : false,
			revertToOriginalValues : false
		},
		"+STYLES" : ["-webkit-transition-property", "-webkit-transition-duration", "-webkit-transition-timing-function", "-webkit-transition-delay", "-webkit-transition"],
		"+NORMALIZE_ZERO_REG_EXP" : /([^\d+-]|^)[+-]?0[a-z%]*/g,
		"+HARDWARE_LAYER_BACKING_PROPERTIES" : ["position"],
		
		"self" : function(definition, reversed){
			this.revertToOriginalValues = null;
			this.removeTargetUponCompletion = null;
			this.delegate = null;
			this.timingFunction = null;
			this.from = null;
			this.to = null;
			this.delay = null;
			this.duration = null;
			this.base = null;
			this.properties = null;
			this.target = null;
			
			this.applied = false;
			this.archivedStyles = null;
			this.archivedValues = [];
			this.archivedBaseValues = [];
			this.definition = definition;
			this.reversed = !!reversed;
		},
		/**
		 * 
		 */
		applyDefaults : function(){
			if(!this.applied){
				for(var prop in this._class.DEFAULTS){
					if(this[prop] == null){
						this[prop] = this._class.DEFAULTS[prop];
					}
				}
				this.applied = true;
			}
		},
		/**
		 * 
		 */
		archiveTransitionStyles : function(){
			if(this.archivedStyles == null){
				var target = qun.Utils.objectIsInstanceOfClass(this.target, View) ? this.target.layer : this.target;
				this.archivedStyles = [];
				for(var i = 0, l = this._class.STYLES.length; i < l; i++){
					this.archivedStyles.push(target.style.getPropertyValue(this._class.STYLES[i]));
				}
			}
		},
		/**
		 * 
		 */
		restoreTransitionStyles : function(){
			for(var i = 0, l = this._class.STYLES.length; i < l; i++){
				this.element.style.setProperty(this._class.STYLES[i], this.archivedStyles[i], "");
			}
			this.archivedStyles = null;
		},
		/**
		 * 
		 */
		archiveBaseValues : function(){
			if(this.revertToOriginalValues){
				if(qun.Utils.objectIsInstanceOfClass(this.target, View)){
					for(var i = 0, l = this.properties.length; i < l; i++){
						this.archivedValues[i] = this.target[this.properties[i]];
					}
					if(this.base){
						for(i = 0, l = this.base.length; i < l; i+=2){
							this.archivedBaseValues[i] = this.target[this.base[i]];
						}
					}
				}else{
					for(var i = 0, l = this.properties.length; i < l; i++){
						this.archivedValues[i] = this.target.style.getPropertyValue(this.properties[i]);
					}
					if(this.base){
						for(i = 0, l = this.base.length; i < l; i+=2){
							this.archivedBaseValues[i] = this.target.style.getPropertyValue(this.base[i]);
						}
					}
				}
			}
		},
		/**
		 * 
		 */
		restoreBaseValues : function(){
			if(qun.Utils.objectIsInstanceOfClass(this.target, View)){
				for(var i = 0, l = this.properties.length; i < l; i++){
					this.target[this.properties[i]] = this.archivedValues[i];
				}
				if(this.base){
					for(i = 0, l = this.base.length; i < l; i+=2){
						this.target[this.base[i]] = this.archivedBaseValues[i];
					}
				}				
			}else{
				for(var i = 0, l = this.properties.length; i < l; i++){
					this.target.style.setPropertyValue(this.properties[i], this.archivedValues[i], null); 
				}
				if(this.base){
					for(i = 0, l = this.base.length; i < l; i+=2){
						this.target.style.setPropertyValue(this.base[i], this.archivedBaseValues[i], null);
					}
				}				
			}
		},
		/**
		 * 
		 */
		processDefinition : function(){
			if(this.definition){
				if(qun.Utils.isFunction(this.definition)){
					if(this.target != null && qun.Utils.objectIsInstanceOfClass(this.target, View)){
						this.definition = this.definition(this.target);
					}else{
						return;
					}
				}
				this.definition = qun.Utils.mixin(this.definition, this);
				if(this.reversed){
					var tmp = this.from;
					this.from = this.to;
					this.to = tmp;
					tmp = null;
				}
			}
		},
		/**
		 * 
		 */
		enforeHardwareLayerBacking : function(){
			if(qun.Utils.objectIsInstanceOfClass(this.target, View)){
				for(var i = 0, l = this.properties.length; i < l; i++){
					if(this._class.HARDWARE_LAYER_BACKING_PROPERTIES.indexOf(this.properties[i]) != -1){
						this.target.wantsAccelerometerBacking = true;
						break;
					}
				}
			}
		},
		/**
		 * 
		 */
		start : function(){
			if(qun.Utils.transaction.openTransactons > 0){
				qun.Utils.transaction.addTransition(this);
			}else{
				this.applyFromState();
				setTimeout(qun.Utils.hook(this,"applyToState"), 0);
			}
			return this;
		},
		/**
		 * 
		 */
		propStatesAreEqualForIndex : function(index){
			var fv = this.from == null ? this.target[this.properties[index]] : this.from[index], tv = this.to[index];
			if(fv instanceof Point && tv instanceof Point || fv instanceof Size && tv instanceof Size){
				return fv.equals(tv);
			}else{
				if(qun.Utils.isString(fv) && qun.Utils.isString(tv)){
					fv = fv.replace(this._class.NORMALIZE_ZERO_REG_EXP, "$10");
					tv = tv.replace(this._class.NORMALIZE_ZERO_REG_EXP, "$10");
				}
				return fv === tv;
			}
		},
		/**
		 * 
		 */
		applyFromState : function(){
			this.processDefinition();
			this.applyDefaults();
			this.archiveTransitionStyles();
			this.archiveBaseValues();
			this.enforeHardwareLayerBacking();
			if(this.from != null){
				if(qun.Utils.objectIsInstanceOfClass(this.target, View)){
					this.target.layer.style.webkitTransitionDuration = 0;
					var i = 0, l;
					if(this.base){
						for(l = this.base.length; i < l; i+=2){
							this.target[this.base[i]] = this.base[i+1];
						}
					}
					for(i = 0, l = this.properties.length; i < l; i++){
						this.target[this.properties[i]] = this.from[i];
					}
				}else{
					this.target.style.webkitTransitionDuration = 0;
					var i = 0, l;
					if(this.base){
						for(l = this.base.length; i < l; i+=2){
							this.target.style.setProperty(this.base[i], this.base[i+1], null);
						}
					}
					for(i = 0, l = this.properties.length; i < l; i++){
						this.target.style.setProperty(this.properties[i], this.from[i], null);;
					}					
				}
			}
		},
		/**
		 * 
		 */
		applyToState : function(){
			var isView = qun.Utils.objectIsInstanceOfClass(this.target, View);
			this.cssProps = [];
			for(var t = [], i = 0, l = this.properties.length; i < l; i++){
				var prop = isView ? Util.VIEW_PROPS.MAPPING[this.properties[i]] : this.properties[i];
				if(this.cssProps.indexOf(prop) > -1){
					//find it
					var duration = qun.Utils.isArray(this.duration) ? this.duration[i] : this.duration,
						timingFunction = qun.Utils.isArray(this.timingFunction) ? this.timingFunction[i] : this.timingFunction,
						delay = qun.Utils.isArray(this.delay) ? this.delay[i] : this.delay;
					t.push([prop, duration + "s", timingFunction, delay + "s"].join(" "));
					this.propStatesAreEqualForIndex(i) || this.cssProps.push(prop);
				}
			}
			this.eventTarget = this.element = isView ? this.target.layer : this.target;
			duration !== 0 && this.element.addEventListener("webkitTransitionEnd", this, false);
			this.completedTransitions = 0;
			this.element.style.webkitTransition = t.join(", ");
			if(isView){
				for(i = 0, l = this.properties.length; i < l; i++){
					this.target[this.properties[i]]  = this.to[i];
				}
			}else{
				for(i = 0, l = this.properties.length; i < l; i++){
					this.target.style.setProperty(this.properties[i], this.to[i], "");
				}				
			}
			this.cssProps.length || setTimeout(this.hook(this, "handleTransitionComplete"), 0);
		},
		/**
		 * 
		 */
		handleTransitionComplete : function(){
			//trigger the complete function in delegate
			qun.Utils.objectHasMethod(this.delegate, this._class.DID_COMPLETE_DELEGATE) && qun.Utils.hook(this.delegate, this._class.DID_COMPLETE_DELEGATE)();
			this.element.removeEventListener("webkitTransitionEnd", this, false);
			if(this.removeTargetUponCompletion){
				var target = this.target;
				qun.Utils.objectIsInstanceOfClass(target, View) ? target.removeFromSuperview() : target.parentNode.removeChild(target);
			}
			this.restoreTransitionStyles();
			this.revertToOriginalValues && this.restoreBaseValues();
		},
		/**
		 * 
		 */
		handleEvent : function(event){
			if(event.target === this.element){
				this.completedTransitions++;
				this.completedTransitions == this.cssProps.length && this.handleTransitionComplete();
			}
		}
	});
	
});