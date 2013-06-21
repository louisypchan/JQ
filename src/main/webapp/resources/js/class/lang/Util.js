def(["qun.lang.Object"], function(Object){
	//TODO: android consider??
	var iOS = navigator.userAgent.match(/OS ([0-9_]+)/);
	var f = declare({
		"@name" : "qun.lang.Util",
		"+VIEW_WILL_APPEAR"    : "view-will-appear",
		"+VIEW_DID_APPEAR"     : "view-did-appear",
		"+VIEW_WILL_DISAPPEAR" : "view-will-disappear",
		"+VIEW_DID_DISAPPEAR"  : "view-did-disappear",
		"+TRANSITION" : {
			"IN_FROM_LEFT" : {
				props : ["transform"],
				from : ["translateX(-100%)"],
				to : ["translateX(0)"]
			},
			"OUT_TO_LEFT" : {
				props : ["transform"],
				from : ["translateX(0)"],
				to : ["translateX(-100%)"]
			},
			"OUT_TO_RIGHT" : {
				props : ["transform"],
				from : ["translateX(0)"],
				to : ["translateX(100%)"]
			},
			"IN_FROM_RIGHT" : {
				props : ["transform"],
				from : ["translateX(100%)"],
				to : ["translateX(0)"]
			},
			"FADE_OUT" : {
				props : ["opacity"],
				from : [1],
				to : [0]				
			},
			"FADE_IN" : {
				props : ["opacity"],
				from : [0],
				to : [1]				
			}
		},
		"+DEVICE" : {
			"iOS" : iOS,
			"iOS_VERSION" : iOS ? iOS[1].replace(/_/g,"") : null,
			"IS_IPAD" : navigator.platform.indexOf("iPad") > -1,
			"HAS_HIDPI_DISPLAY" : window.devicePixelRatio >= 2
		},
		"+VIEW_PROPS" : {
			"AUTORESIZING" : {
				"LEFT_MARGIN" : 1,
				"WIDTH" : 2,
				"RIGHT_MARGIN" : 4,
				"TOP_MARGIN" : 8,
				"HEIGHT" : 16,
				"BOTTOM_MARGIN" : 32 //the height of safari status bar
			},
			"MAPPING" : {
				opacity : "opacity",
				transform : "-webkit-transform",
				position : "-webkit-transform",
				anchorPoint : "-webkit-transform-origin",
				doubleSized : "-webkit-backface-visibility",
				zIndex : "z-index"
			}
		},
		"+NavBar_PROPS" : {
			"DEFAULT_HEIGHT" : 44,
			"WILL_PUSH_ITEM" : "navigationBarWillPushItem",
			"DID_PUSH_ITEM" : "navigationBarDidPushItem",
			"WILL_POP_ITEM" : "navigationBarWillPopItem",
			"DID_POP_ITEM"	: "navigationBarDidPopItem"
		},
		"-Archiver" : {
			"_uid" : 1,
			"objectReferences" : {},
			"WILL_ENCODE_OBJECT" : "willEncodeObjectToArchive",
			"DID_ENCODE_OBJECT" : "didEncodeObjectToArchive",
			"WILL_RESTORE_OBJECT" : "willRestoreFromArchive",
			"DID_RESTORE_OBJECT" : "didRestoreFromArchive"
		},
		//TODO: multipule parents supportive
		"-archive" : function(source, target){
			if(!target){
				target = {};
				return {
					__root : this.archive(source, target),
					__objects : target
				};
			}
			if(qun.Utils.isPrimitive(source)){ 
				return source; 
			}else if(qun.Utils.isArray(source)){
				return source.map(function(i){
					return this.archive(i);
				}, this);
			}
			var uid = source._uid || (source._uid = this.Archiver._uid++), map, name;
			if(!target[uid]){
				map = target[uid] = {};
				if(qun.Utils.objectIsInstanceOfClass(source, Object)){
					var it = source._class;
					map._className = it._name;
					it = this.archivePropsForClass(it);
					qun.Utils.objectHasMethod(source, this.Archiver.WILL_ENCODE_OBJECT) && source[this.Archiver.WILL_ENCODE_OBJECT](map);
					for(name in it){
						map[name] = this.archive(source.archiveProp(name), target);
					}
					qun.Utils.objectHasMethod(source, this.Archiver.DID_ENCODE_OBJECT) && source[this.Archiver.DID_ENCODE_OBJECT](map);
				}else{
					for(x in source){
						if(name != "_uid"){
							map[name] = this.archive(source[name], target);
						}
					}
				}
			}
			return {
				_uid : uid
			};
		},
		//TODO: multipule parents supportive
		"-archivePropsForClass" : function(it){
			var archivePropMap = it._archivePropMap;
			if(archivePropMap) return archivePropMap;
			archivePropMap = it._archivePropMap = {};
			var superclass = it._meta ? it._meta.super : null;
			//console.log(superclass ? superclass._name : null);
			superclass && qun.Utils.mixin(this.archivePropsForClass(superclass), archivePropMap);
			var archivedProps = it.archivedProps || [];
			for(var i = 0, l = archivedProps.length; i < l; i++){
				archivePropMap[archivedProps[i]] = true;
			}
			var excludedProps = it.excludedProps || [];
			for(i = 0, l = excludedProps.length; i < l; i++){
				delete archivePropMap[excludedProps[i]];
			}
			return archivePropMap;
		},
		//TODO: multipule parents supportive
		"-archiveToString" : function(it){
			return JSON.stringify(this.archive(it));
		},
		//TODO: multipule parents supportive
		restoreArchive : function(source, target, dict){
			if(qun.Utils.isPrimitive(source)){
				return source;
			}else if(source.__root){
				return this.restoreArchive(source.__root, source.__objects, {});
			}else if(source._uid){
				var uid = source._uid;
				return dict[uid] || (dict[uid] = this.restoreArchive(target[uid], target, dict));
			}else if(qun.Utils.isArray(source)){
				return source.map(function(i){
					return this.restoreArchive(i, target, dict);
				}, this);
			}else{
				var rs = {};
				for(var name in source){
					if(name != "_className"){
						rs[name] = this.restoreArchive(source[name], target, dict);
					}
				}
				if(source._className){
					var cls = qun.Utils.getProp(source._className.split(".")), _class = cls, m;
					do{
						m = _class.restoreArchive;
					}while(!m && (_class = _class._meta ? _class._meta.super : null));
					cls = m ? m.call(cls, rs) : new cls;
					qun.Utils.objectHasMethod(source, this.Archiver.WILL_RESTORE_OBJECT) && source[this.Archiver.WILL_RESTORE_OBJECT](source);
					for(name in rs){
						cls.restoreProp(name, rs[name]);
					}
					qun.Utils.objectHasMethod(source, this.Archiver.DID_RESTORE_OBJECT) && source[this.Archiver.DID_RESTORE_OBJECT](source);
					return cls;
				}else{
					return rs;
				}				
			}
		},
		//TODO: multipule parents supportive
		"-restoreWithJSON" : function(it){
			return it ? this.restoreArchive(JSON.parse(it)) : null;
		},	
		"-registeredViewClass" : {},
		"-registerViewClass" : function(view){
			this.registeredViewClass[view.baseCSSClass] = view;
		},
		/**
		 * short for translate
		 */
		"-t": function(x, y){
			return this.t3d(x, y , 0);
		},
		/**
		 * translate3d
		 */
		"-t3d" : function(x, y, z){
			qun.Utils.sanitizeNumber(arguments);
			return "translate3d(" + x + "px, " + y + "px, " + z + "px)";
		},
		"-tm" : function(x, y){
			qun.Utils.sanitizeNumber(arguments);
			return "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + x + ", " + y + ", 0, 1)";
		},
		/**
		 * 
		 * @param str
		 * @returns {WebKitCSSMatrix}
		 */
		"-matrixFromString" : function(str){
			var matrix = "";
			if(str.length > 0 && str != "none"){
				matrix = str.replace(/([^(]*)\(([^)]*)\)/g,function($0, $1, $2){
					$0 = $2.replace(/(\-?[0-9.]+(?:e\-?[0-9]+)?)([^,]*)/g, function(_1,_2,_3){ //f,g,h
						_2 = parseFloat(_2);
						return qun.Utils.toFixed(_2, {precision : 6, decimalSeparator : ".", thousandsSeparator : ","}) + _3;
					});
					return _2 + "(" + $0 + ")";
				});
			}
			return new WebKitCSSMatrix(matrix);
		},
		/**
		 * 
		 * @param m1
		 * @param m2
		 * @returns {Boolean}
		 */
		"-matrixEqualsToMatrix" : function(m1, m2){
			for(var i = 1; i <= 4; i++){
				for(var j = 1; j <= 4; j++){
					var tmp = "m" + i + j;
					if(m1[tmp] !== m2[tmp]){
						return false;
					}
				}
			}
			return true;
		},
		/**
		 * 
		 */
		"-concatTransforms" : function(){
			for(var a = [], i = 0, l = arguments.length; i < l; i++){
				var arg = arguments[i];
				arg && arg != "none" && a.push(arg);
			}
			return a.join(" ");
		},
		/**
		 * 
		 * @param value
		 * @returns {Number}
		 */
		"-roundedPxValue" : function(value){
			var pixelRatio = window.devicePixelRatio;
			return (pixelRatio * value | 0) / pixelRatio;
		},
		/**
		 * see dojo foundation string.subsitute
		 * extends it to support Array ${nls.arr[0]}
		 */
		"-tmpl" : function(template, map, transform, context){
			context = context || window;
			//if transform is defined, String must be returned
			transform = transform ? qun.Utils.hook(context, transform) : function(v) { return v;};
			//extend the regular expression
			return template.replace(/\$\{([^\s\:\}]+)(?:\[?(\d*)\]?)(?:\:([^\s\:\}]+))?\}/g, function(match, key, index, format){
				var value = qun.Utils.getProp(key.split("."), false, map);
				if((index || index == "0") && qun.Utils.isArray(value)){
					value = value[index];
				}
				if(format){
					value = qun.Utils.getProp(format.split("."), false, context).call(context, value, key);
				}
				return transform(value, key);
			});
		},
		/**
		 * 
		 * @param className
		 */
		"-isClassNameValid" : function(className){
			return className != null && className !="" && className === String(className).replace(/\s/g,"");
		},
		/**
		 * Check the class is already one of the element's class?
		 * @param it
		 * @param className
		 * @returns
		 */
		"-itHasClassName" : function(it, className){
			return qun.CONST.SUPPORT_CLASS_LIST ? this.isClassNameValid(className) && it.classList.contains(className) : RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)").test(it.className);
		},
		/**
		 * 
		 * @param it
		 * @param className
		 */
		"-addClass" : function(it, className){
			var exist = this.itHasClassName(it, className);
			if(qun.CONST.SUPPORT_CLASS_LIST){
				if(!exist){
					it.classList.add(className);
				}
			}else{
				if(!exist){
					it.className = [it.className, className].join(" ");
				}
			}
		},
		"-removeClass" : function(it, className){
			var exist = this.itHasClassName(it, className);
			if(qun.CONST.SUPPORT_CLASS_LIST){
				if(exist){
					it.classList.remove(className);
				}
			}else{
				if(exist){
					it.className = it.className.replace(RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)"), " ");
				}
			}			
		},
		"-toggleClass" : function(it, className){
			var exist = this.itHasClassName(it, className);
			this[!exist ? "addClass" : "removeClass"](it, className);
		}
	});
	
	return new f();
});