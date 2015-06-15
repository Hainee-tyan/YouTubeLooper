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
		script.setAttribute("id", "ytp-loop-script-by-hainee");
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


var ytLoopByHaineeExtension = {

	oldVideoSrc: null,
	onPageLoad: function(event) {		
	  	if (event.originalTarget instanceof Components.interfaces.nsIDOMHTMLDocument) {
		    var win = event.originalTarget.defaultView;

		    if (win.frameElement) {
		      win = win.top;
		    }

		    var URL = win.location.href;
		    if (URL.match(/(http|https).*youtube.*watch/i)) {

		    	var newVideoSrc = content.document.getElementsByTagName("video")[0].getAttribute("src");
		    	if (win.has_yt_loop_by_hainee) {
		    		if (this.oldVideoSrc == newVideoSrc) 
		    			return;
		    		this.oldVideoSrc = newVideoSrc;
		    		var loopButton = content.document.getElementById("ytp-loop-button-by-hainee");

		    		if (loopButton.getAttribute("loop") == "true") {
						loopButton.style.backgroundPosition = "center top";	
						loopButton.setAttribute("data-tooltip-text", "Not looping");
						loopButton.setAttribute("loop", "false");
					}
					return;
		    	};

		    	// var script = content.document.getElementById("ytp-loop-script-by-hainee");
		    	// if (script)
		    	// 	content.document.head.removeChild(script);
		    	// var button = content.document.getElementById("ytp-loop-button-by-hainee");
		    	// var buttonsBar = content.document.getElementsByClassName("html5-player-chrome")[0];
		    	// if (button && buttonsBar) 
		    	// 	buttonsBar.removeChild(button);
		    	foo();
		    	win.has_yt_loop_by_hainee = true;
		    };

	  	};
	}
};

window.addEventListener("load", function () {
	gBrowser.addEventListener("load", ytLoopByHaineeExtension.onPageLoad, true);
}, false);
