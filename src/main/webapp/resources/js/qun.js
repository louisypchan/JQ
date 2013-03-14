/**
 * COPYRIGHT. Louis Y P Chen ALL RIGHTS RESERVED.
 * 
 */
/**
 * declare({
 *  "@superclass" : Function || Array
 *  "@name" : String
 *  
 *  "-property" : Object
 *  
 *  self : Function  - Constructor
 *  
 *  
 * });
 *
 */

;(function(win){

	//"use strict";

	var qun = {}, toString = {}.toString, op = Object.prototype,
	bugForInSkips = (function(){
		for(var i in {toString : 1}){
			return 0;
		}
		return 1;	
	}()),
	aF = new Function,
	extraNames = (bugForInSkips ? "hasOwnProperty.valueOf.isPrototypeOf.propertyIsEnumerable.toLocaleString.toString.constructor".split(".") : []);

	qun.version = "0.1";

	/**
	 * defineProperty supportive
	 */
	if(Object.defineProperty === undefined){
		/**
		 * Simple implement, not include value configurable...etc.
		 * @param obj
		 * @param prop
		 * @param descriptor
		 */
		Object.defineProperty = function(obj, prop, descriptor){
			obj.__defineSetter__(prop, descriptor.set);
			obj.__defineGetter__(prop, descriptor.get);
			//value??
		};
	}	

	qun.CONST = {
			PRIVATE_PREFIX : "-",
			CONSTRUCTOR : "self",
			SKIP_PREFIX : "@",
			SYNTHESIZE : "@synthesize",
			SUPERCLASS : "@superclass",
			CLASSNAME : "@name"
	};

	qun.Utils = {
			/**
			 * 
			 * @param it
			 * @returns {Boolean}
			 */
			isFunction : function(it){
				return toString.call(it) === "[object Function]";
			},
			/**
			 * 
			 * @param it
			 * @returns {Boolean}
			 */
			isArray : function(it){
				return toString.call(it) === "[object Array]";
			},
			/**
			 * 
			 * @param it
			 * @returns {Boolean}
			 */
			isString : function(it){
				return toString.call(it) === "[object String]";
			},
			/**
			 * 
			 * @param obj
			 * @param name
			 * @returns {Boolean}
			 */
			isNotObjectProperty : function(obj, name){
				return (obj !== op[name] || !(name in op));
			},
			/**
			 * 
			 * @param object
			 * @param method
			 * @returns {Boolean}
			 */
			objectHasMethod : function(object, method){
				return object != null && object[method] !== undefined && this.isFunction(object[method]);
			},		
			/**
			 * 
			 * @param it
			 * @returns {Boolean}
			 */
			isPrivate : function(it){
				return it.indexOf(qun.CONST.PRIVATE_PREFIX) > -1;
			},
			isSkipable : function(it){
				return it.indexOf(qun.CONST.SKIP_PREFIX) > -1;
			},
			/**
			 * 
			 * @param parts
			 * @param create
			 * @param context
			 * @returns
			 */
			getProp : function(parts, create, context){
				var p, i = 0;
				if(!context){
					if(!parts.length){
						return window;
					}else{
						p = parts[i++];
						context = window[p] || (create ? window[p] = {} : undefined);
					}
				}
				while(context && (p = parts[i++])){
					context = (p in context ? context[p] : (create ? context[p] = {} : undefined));
				}
				return context;
			},
			set : function(name, value, context){
				var parts = name.split("."), p = parts.pop(), obj = qun.Utils.getProp(parts, true, context);
				return obj && p ? (obj[p] = value) : undefined;
			},		
			/**
			 * 
			 * @param target
			 * @param source
			 */
			safeMixin : function(target, source){
				var name, t;
				for(name in source){
					t = source[name];
					//console.log(name);
					if(qun.Utils.isNotObjectProperty(t, name) && name != qun.CONST.CONSTRUCTOR && !qun.Utils.isSkipable(name)){
						//crack private
						if(qun.Utils.isPrivate(name)){
							name = name.substr(1);
							t._private = true;
						}
						if(qun.Utils.isFunction(t)){
							t._name = name;
						}
						target[name] = t;
					}
				}
				for(var i = extraNames.length; i;){
					name = extraNames[--i];
					t = source[name];
					if(qun.Utils.isNotObjectProperty(t, name) && name != qun.CONST.CONSTRUCTOR && !qun.Utils.isSkipable(name)){
						//crack private
						if(qun.Utils.isPrivate(name)){
							name = name.substr(1);
							t._private = true;
						}
						if(qun.Utils.isFunction(t)){
							t._name = name;
						}					
						target[name] = t;
					}				
				}		
			},
			/**
			 * 
			 * @param target
			 * @param source
			 */
			extend : function(target, source){
				var name, t;
				for(name in source){
					t = source[name];
					//console.log(name);
					if(qun.Utils.isNotObjectProperty(t, name) && name != qun.CONST.CONSTRUCTOR && !qun.Utils.isSkipable(name)){
						if(qun.Utils.isFunction(t)){
							t._name = name;
						}
						target[name] = t;
					}
				}
				for(var i = extraNames.length; i;){
					name = extraNames[--i];
					t = source[name];
					if(qun.Utils.isNotObjectProperty(t, name) && name != qun.CONST.CONSTRUCTOR && !qun.Utils.isSkipable(name)){
						if(qun.Utils.isFunction(t)){
							t._name = name;
						}
						target[name] = t;
					}				
				}

				//delete privates
				for(name in target){
					if(target[name]._private){
						delete target[name];
						t = target.__proto__;
						while(t && !t[name]){
							t = t.__proto__;
						}
						if(t && t[name]){
							delete t[name];
						}
					}
				}
			}
	};
	/**
	 * Merge Impl
	 */
	function merge(args){
		if(args){
			var t, l = args.length, top = 0, index, res = [];
			for(var i = 0; i < l; i++){
				t = args[i][0];
				top = 0;
				index = -1;
				//
				for(var j = i+1; j < l; j++){
					index = args[j].indexOf(t);
					top += index;
					//find in the first
					if(index == 0){
						args[j].splice(index,1);
						if(args[j].length == 0){
							args.splice(j, 1);
						}
						//break;
					}
					//still can find it, but not in the first
					//
					if(index > -1){
						top += index;
					}
				}
				//
				if(top == 0 || top == -1){
					res.push(t);
					args[i].splice(0,1);
					if(args[i].length == 0){
						args.splice(i,1);
					}
					break;
				}
			}
			if(!res.length){
				throw new Error("can't build consistent linearization");
			}
			return res;
		}
	};
	/**
	 * 
	 */
	var constructorBuilder =  function(it){
		return function(){
			if(it){
				for(var i = 0, l = it.length; i < l; i++){
					//console.log(it[i]);
					it[i].apply(this, arguments);
				}
			}
		};
	},
	synthesizeProperty = function(proto, prop){
		var m = prop.charAt(0).toUpperCase() + prop.substr(1),
		//get
		mGet = "get" + m,
		//set
		mSet = "set" + m,
		// real var in use
		_prop = "_" + prop;
		//
		qun.Utils.objectHasMethod(proto, mSet) || (proto[mSet] = function(value){
			this[_prop] = value;
		});
		//define setter
		var setter = function(value){
			this[mSet](value);
			//anything needs?
		};
		qun.Utils.objectHasMethod(proto, mGet) || (proto[mGet] = function(){
			return this[_prop];
		});
		//define getter
		var getter = function(){
			return this[mGet]();
		};
		//
		Object.defineProperty(proto, prop, {
			get : getter,
			set : setter
		});		
	},
	callSuperImpl = function(){
		var caller = callSuperImpl.caller, name = caller._name,
		meta = this._class._meta, p, _super;
		if(meta.super){
			_super = [].concat(meta.super);
			_super = _super[_super.length - 1];
			p = _super.prototype;
			if(p && p[name] && qun.Utils.isFunction(p[name])){
				p[name].apply(p, arguments);
			}
		}
	},
	/**
	 * http://www.python.org/download/releases/2.3/mro/
	 * class A(O)
	 * class B(O)
	 * class C(O)
	 * 
	 * class E(A,B)
	 * 
	 * mro(A) = [A,O]
	 * mro(B) = [B,O]
	 * mro(E) = [E] + merge(mro(A), mro(B), [A,B])
	 * 			[E] + ([A,O], [B,O], [A,B])
	 * 			[E,A] 
	 * [A,B]
	 */
	MRO  = function(it){
		var t = it._meta.super, seqs = [it];
		if(t){
			if(!qun.Utils.isArray(t)){
				return seqs.concat(t);
			}else{
				while(true){
					seqs = seqs.concat(t);
					t = t._meta.super;	
					if(!t){
						break;
					}
				}
				return seqs;
			}
		}
		return seqs;
	},
	/**
	 * // C3 Method Resolution Order (see http://www.python.org/download/releases/2.3/mro/)
	 */
	mro_c3 = function(bases){
		var l = bases.length,t;
		if(l == 1){
			if(!bases[0]._meta.super){
				return bases;
			}else{
				return bases.concat(mro_c3([].concat(bases[0]._meta.super)));
			}
		}else{
			var seqs = [], res = [];
			for(var i = 0; i < l; i++){
				seqs.push(MRO(bases[i]));
			}
			//
			seqs.push(bases);
			//
			while(seqs.length){
				res = res.concat(merge(seqs));
			}
			return res;
		}
	};

	/**
	 * 
	 * @param it
	 * @returns
	 */
	qun.Class = function(it){
		var superclass = it[qun.CONST.SUPERCLASS], p = "safeMixin", proto = {}, className  = it[qun.CONST.CLASSNAME], constructor=[], mro = [];
		if(superclass){
			//
			if(qun.Utils.isFunction(superclass)){
				//force new
				aF.prototype = superclass.prototype;
				proto = new aF;
				//clean up
				aF.prototype = null;
				if(superclass._meta){
					constructor = constructor.concat(superclass._meta.constructor);
				}
			}else if(qun.Utils.isArray(superclass)){
				t = superclass.slice(0);
				t = mro_c3(t);
				for(var i = 0, base, l = t.length;  i < l; i++){
					base = t[i];
					aF.prototype = base.prototype;
					qun.Utils.safeMixin(proto, new aF);
					aF.prototype = null;
					if(base._meta){
						constructor = constructor.concat(base._meta.constructor);
					}
				}

			}
			p = "extend";
		}
		//add all properties
		qun.Utils[p](proto, it);

		if(it.self){
			constructor = constructor.concat(it.self);
		}

		//console.log(proto);
		//console.log(constructor);
		var f = (function(ctor){
			return function(){
				f.executed || qun.Class.processSynthesize();
				if(ctor){
					for(var i = 0, l = ctor.length; i < l; i++){
						ctor[i] && ctor[i].apply(this, arguments);
					}
				}
			};
		})(constructor);
		//
		f.executed = false;
		//cache meta information
		f._meta = {constructor : it.self, synthesize : it[qun.CONST.SYNTHESIZE], super : superclass};
		//
		proto.callSuper = callSuperImpl;
		//construct the prototype
		f.prototype = proto;
		//cache the construct class
		proto._class = f;
		//add name if specified
		if(className){
			qun.Utils.set(className, f);
		}
		//push synthesize properties
		qun.Class.synthesizes.push(f);
		//return function
		return f;
	};
	//cache synthesize
	qun.Class.synthesizes = [];
	/**
	 * 
	 */
	qun.Class.processSynthesize = function(){
		for(var it, i = 0, l = qun.Class.synthesizes.length; i < l; i++){
			it = qun.Class.synthesizes[i];
			it.executed || qun.Class.injectSynthesize(it);
		}
		qun.Class.synthesizes.length = 0;
	};
	/**
	 * 
	 * @param it
	 */
	qun.Class.injectSynthesize = function(it){
		for(var i = 0 , synthesize = it._meta.synthesize, l = synthesize ? synthesize.length : 0; i < l; i++){
			synthesizeProperty(it.prototype, synthesize[i]);
		}
		it.executed = true;
	};
	/**
	 * @param it
	 */
	var declare = function(it){
		return qun.Class(it);
	};
	/**
	 * dove("qun.lang.Object", function(Object){
	 * 	 	
	 * });
	 * 
	 * 
	 */
	var exec, dove;
	/**
	 * put them out
	 */
	win.declare = declare;

	//import(String||Array, function(alias - optional)....
	/**
	 * Root Class
	 */
	declare({
		"@name" : "qun.lang.Object",
		"@synthesize" : ["delegate"],
		"self" : function(){

		}
	});

	/**
	 * Below functions depends on requirejs from http://requirejs.org/
	 * 
	 * Code refractoring here for purpose
	 */
	if(typeof require !== "undefined"){
		var baseUrl = (function(doc){
			var scripts = doc.getElementsByTagName("script"),
			i = 0,
			l = scripts.length,
			script, dir, src, match;
			while(i < l){
				script = scripts[i++];
				if((src = script.getAttribute("src")) && (match = src.match(/(((.*)\/)|^)qun\.js(\W|$)/i))){
					dir = match[3] || "";
					break;
				}
			}
			return dir;
		})(document);
		//default configuration
		dove = function(){
			var args = arguments,t;
			if(qun.Utils.isString(args[0])){
				args[0] = args[0].replace(/\./g, "/");
			}
			if(qun.Utils.isArray(args[0])){
				t = args[0].join("|");
				t = t.replace(/\./g, "/");
				args[0] = t.split("|");
			}
			require.apply(this, args);
		};
		//cache
		dove.config = require.config;
		//
		dove.config({
			baseUrl : baseUrl,
			paths : {
				"qun" : "class"
			}
		});
	}

	/**
	 * End area ======================================================
	 */	



	//win["@"] = _qun;
})(window);