/*!
 * jQuery meBlock plugin
 * Version 1.0.1-2022.02.18
 * Requires jQuery v1.7 or later
 *
 */
 
 
$.fn.meBlock = function(stt, options) {
 
	
	var defaults = { 
		"type" 	 	: "typing_loader",
		"msg"  	 	: " ",
		"id"	 	: null,
		"left"	 	: "0px",
		"opacity"	: 0.1,
		"bgColor"	: "#1c1c1c",
		"centerTop"	: "0px"
	};

	var settings = $.extend({function(){}}, defaults,options);
	
	var rdLoadingId = 1;
	
	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		  r: parseInt(result[1], 16),
		  g: parseInt(result[2], 16),
		  b: parseInt(result[3], 16)
		} : null;
	  }
	
    return this.each(function() {
 
		
		
		var $elm = $(this);
	
		$elm.css("position","relative");

		var show = false;
	
	
		if(stt===true || stt==="show"){
			show = true;
		}else{
			show = false;
		}

		
		//ayar obje değilse	type ata	
		if(options!=null && !typeof options === 'object'){
			settings.type = options;
		}
			
		if(settings.id){
			rdLoadingId = settings.id;
		}	
			
		var $div = $('<div data-rd-loading-id="'+rdLoadingId+'" class="rdLoadingArea"><div class="rdLoadingAreaCenter"><div class="'+settings.type+'"></div><div class="messageArea">'+settings.msg+'</div></div>');
		
		// göster
		if(show && $elm.find($div).first().length==0 && !$(".rdLoadingArea").is(":visible")){	
						
			$elm.prepend($div);

			 $(".rdLoadingArea").css('background-color',settings.bgColor);
			
			var rcA = hexToRgb(settings.bgColor);

			$(".rdLoadingArea").css({height:settings.height,"background-color":"rgb("+rcA.r+","+rcA.g+","+rcA.b+","+settings.opacity+")"});
			$(".rdLoadingAreaCenter").css({marginLeft:settings.left, marginTop:settings.centerTop});
			$elm.data("rd-loading-id",rdLoadingId);
			
			rdLoadingId++;
			
		// gizle
		}else if(!show && $div.length>0){
			
			var id = $elm.data("rd-loading-id");
			$div = $(".rdLoadingArea[data-rd-loading-id='"+id+"']", $elm).first();
			//console.log($div);
			$div.remove();
			
			$elm.removeAttr("data-rd-loading-id");
			
		}
		

	});

};	
