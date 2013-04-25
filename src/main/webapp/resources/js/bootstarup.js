window.addEventListener("DOMContentLoaded", function(){
	req(["qun.impl.view.RootView","qun.lang.Util"], function(RootView, Util){
		
		var t = new RootView(document.body);
		
		/*var a = JSON.stringify(Util.archive(t));
		
		console.log(Util.restoreWithJSON(a));*/
	});
	
}, true);
