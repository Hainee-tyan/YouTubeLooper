// var x = document.getElementById("urlbar");
// x.inputField.onchange = function() {
// 	alert(this.value);
// };

function foo(){
	var win = content;
	var url = content.location.href;
	if (url.match(/youtube.*watch/i)) {
		var doc = content.document;

		//var buttonsBar = doc.getElementsByClassName("html5-player-chrome");
		var buttonsBar = doc.getElementsByClassName("html5-player-chrome");
		var player = doc.getElementById("movie_player");

		// var newButton = document.createElement("DIV");
		// newButton.setAttribute("class", "ytp-button yt-uix-tooltip");		
		// newButton.setAttribute("data-tooltip-text", "Loop");
		// newButton.style.width = "30px";
		// newButton.style.height = "27px";
		// newButton.style.float = "right";
		// newButton.style.background = 'transparent url(chrome://youtubeloop/content/loop.png) no-repeat center/50%';
		// newButton.style.backgroundColor = "transparent";
		// newButton.style.backgroundImage = "url(chrome://youtubeloop/content/noLoop.png)";
		// newButton.style.backgroundRepeat = "no-repeat";
		// newButton.style.backgroundPosition = "center center";
		// newButton.style.backgroundSize = "contain";

		var newButton = document.getElementById("ytp-loop-button-by-hainee").cloneNode();
		newButton.setAttribute("onclick", "ytLoopByHainee(this)");
		//newButton.onclick = loopFunction(newButton);
		//newButton.style.backgroundImage = "url(chrome://youtubeloop/content/loop.png)";

		//var video = doc.getElementsByTagName("video");

		// if (video) {
		// video[0].setAttribute("loop", "loop");
		// // var src = video[0].src;

		// // video[0].onabort = function(event) {
		// // 	var newSrc = event.ta.src;
		// // 	alert(newSrc);
		// // 	if (newSrc != src)
		// // 	this.removeAttribute("loop");
		// // };
		// };

		var script = doc.createElement("SCRIPT");
		var scriptText = doc.createTextNode(ytLoopByHainee);
		script.appendChild(scriptText);
		doc.head.appendChild(script);

		if(buttonsBar)
			buttonsBar[0].appendChild(newButton);
	};
};

function ytLoopByHainee(loopButton) {
	var isLooping = loopButton.getAttribute("loop");
	if (isLooping == "true") {
		loopButton.style.backgroundPosition = "center top";	
		loopButton.setAttribute("data-tooltip-text", "Not looping");
		loopButton.setAttribute("loop", "false");
	}
	else {
		loopButton.style.backgroundPosition = "center bottom";
		loopButton.setAttribute("data-tooltip-text", "Looping");
		loopButton.setAttribute("loop", "true");
	}
};