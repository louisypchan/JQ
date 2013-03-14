/**
 * COPYRIGHT. Louis Y P Chen ALL RIGHTS RESERVED.
 * 
 */
;(function(){
	var jq = {}, toString = {}.toString;
	jq.version = "0.1";
	
	//TODO : implement AMD mode
	jq.req = {};
	jq.def = {};
	// Simple Utils
	jq.Utils = {
		/**
		 * 
		 * @param source
		 * @param target
		 */	
		mixin : function(source, target){
			for(var property in source){
				target[property] = source[property];
			}
		},
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
		isString : function(it){
			return toString.call(it) === "[object String]";
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
		isPrimitive : function(it){
			return it == null || typeof it == "number" || typeof it == "boolean" || this.isString(it);
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
		 * @param object
		 * @param Class
		 * @returns {Boolean}
		 */
		objectIsInstanceOfClass : function(object, Class){
			return object != null && object instanceof Class;
		},
		/**
		 * 
		 * @param object
		 * @param name
		 */
		setupDisplayNames : function(object, name){
			name = name || object.displayName || object.name;
			for(var p in object){
				if(!object.__lookupGetter__(p)){
					var property =  object[p];
					if(jq.Utils.isFunction(property)){
						property.displayName = jq.Utils.createDisplayName(name, p);
					}
				}
			}
		},
		createDisplayName : function(){
			
		}
	};
	
	jq.class = function(){
		
	}; 
})();

