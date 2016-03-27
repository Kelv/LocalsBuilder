function loadImage(){
	var file = $("#logoFile")["0"].files[0];
	var reader = new FileReader();
	reader.onloadend = function(){
		$(".img-thumbnail").remove();
		var el = $("<img>");
		el.attr("src", reader.result);
		el.attr("width", "250");
		el.attr("height", "250");
		el.addClass("img-thumbnail");
		$("#logoIcon").append(el);
	};

	if(file){
		reader.readAsDataURL(file);
	}else{
		$("#logoIcon").attr("src", "");
	}
};