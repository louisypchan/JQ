def(["qun.lang.Object"], function(Object){
	
	return declare({
		"@name" : "qun.lang.Point",
		"@superclass" : Object,
		
		
		
		"self" : function(x,y){
			this.x = x!=null && !isNaN(x) ? x : 0;
			this.y = y!=null && !isNaN(y) ? y : 0;
		},
		
		clone : function(){
			return qun.lang.Point(this.x, this.y);
		},
		
		equals : function(p){
			return this.x == p.x && this.y == p.y;
		},
		
		toString : function(){
			return "qun.lang.Point[" + this.x + "," + this.y + "]";
		}
	});
});