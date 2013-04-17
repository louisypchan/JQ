def(function(){
	
	var f = declare({
		"@name" : "qun.lang.Util",
		"+VIEW_WILL_APPEAR"    : "view-will-appear",
		"+VIEW_DID_APPEAR"     : "view-did-appear",
		"+VIEW_WILL_DISAPPEAR" : "view-will-disappear",
		"+VIEW_DID_DISAPPEAR"  : "view-did-disappear",
		
		
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
				if(!exist){
					it.classList.remove(className);
				}
			}else{
				if(!exist){
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