def(["qun.lang.Object"], function(Object){
	
	return declare({
		"@name" : "qun.lang.Size",
		"@superclass" : Object,
		
		
		
		"self" : function(w, h){
			this.width = w!=null && !isNaN(w) ? w : 0;
			this.height = h!=null && !isNaN(h) ? h : 0;
		},
		
		clone : function(){
			return qun.lang.Size(this.width, this.height);
		},
		
		equals : function(obj){
			return this.width == obj.width && this.height == obj.height;
		},
		
		toString : function(){
			return "qun.lang.Size[" + this.width + "," + this.height + "]";
		}
	});
});