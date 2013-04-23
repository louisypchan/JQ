def(function(){
	/**
	 * 
	 */
	return declare({
		"@name" : "qun.lang.Object",

		"@synthesize" : ["delegate"],

		"+OBSERVER_CHANGED" : "observerChangeHandler",

		"self" : function(){
			this.observedprops = {};
		},

		addObserver : function(name, scope, method){
			var observedprop = this.observedprops[name];
			if(observedprop !== undefined){
				if(observedprop.scopes.indexOf(scope) > -1) return;
			}else{
				method = method || qun.lang.Object.OBSERVER_CHANGED;
				if(qun.Utils.objectHasMethod(scope, method)){
					this.observedprops[name] = {
							scope : scope,
							method : method
					};					
				}
			}
		},

		removeObserver : function(name){
			if(this.observedprops[name] === undefined) return false;
			delete this.observedprops[name];
		},
		
		notifyPropChange : function(name, args){
			var observedprop = this.observedprops[name];
			if(observedprop){
				qun.Utils.hook(observedprop.scope, observedprop.method, args)();
			}
		}
	});
});