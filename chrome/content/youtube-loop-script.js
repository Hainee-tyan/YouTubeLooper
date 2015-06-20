var ytLoopExtensionByHainee = {

	//experiment function only
	
	// ytLoopByHaineeToolbarCommand: function() {
	// 	var url = content.location.href;
	// 	if (url.match(/youtube.*watch/i)) {
	// 		//	this.insertYtloopByHainee();
	// 		var doc = content.document;
	// 		var buttonsBar = doc.getElementById("watch8-secondary-actions");
	// 		var button = document.getElementById("ytp-loop-button-by-hainee").cloneNode(true);
	// 		if (buttonsBar)
	// 			buttonsBar.insertBefore(button, buttonsBar.lastChild);

	// 		var script = doc.createElement("SCRIPT");
	// 		var scriptText = doc.createTextNode(ytLoopExtensionByHainee.onclickYtloopbutton2ByHainee);
	// 		script.appendChild(scriptText);
	// 		script.setAttribute("id", "ytp-loop-script-by-hainee");
			
	// 		doc.head.appendChild(script);
	// 	};
	// },

	//clone button from .xul overlay
	getYtloopButtonByHainee: function() {
		return document.getElementById("ytp-loop-button-by-hainee").cloneNode(true);
	},

	//create script from "onclickYtloopButtonByHainee" function
	createYtloopScriptByHainee: function(doc) {
		var script = doc.createElement("SCRIPT");

		//append player variable
		var scriptText = doc.createTextNode("var ytPlayerByHainee = null;");
		script.appendChild(scriptText);

		//append boolean variable, telling if player is flash based
		scriptText = doc.createTextNode("var isPlayerFlashByHainee = null;");
		script.appendChild(scriptText);

		//append interval variable
		//needed if youtube player is flash
		scriptText = doc.createTextNode("var loopIntervalByHainee = null;");
		script.appendChild(scriptText);

		//append function executing on button click
		scriptText = doc.createTextNode(this.onclickYtloopButtonByHainee);
		script.appendChild(scriptText);

		//append loop listener function itself
		scriptText = doc.createTextNode(this.ytLoopFunctionByHainee);
		script.appendChild(scriptText);

		script.setAttribute("id", "yt-loop-script-by-hainee");
		return script;
	},

	//reset loop interval if it was set, player variable
	//in case it changed and boolean variable if player is flash based.
	//create script to run on page and delete it immediately
	setYtloopVariablesByHainee: function(doc) {
		var script = doc.createElement("SCRIPT");

		//player variable
		var scriptText = doc.createTextNode("ytPlayerByHainee = document.getElementById('movie_player');");
		script.appendChild(scriptText);

		//boolean variable if player is flash based
		scriptText = doc.createTextNode("isPlayerFlashByHainee = (ytPlayerByHainee.tagName.toLowerCase() == 'embed');");
		script.appendChild(scriptText);

		//removing loop listener if it was set
		scriptText = doc.createTextNode('ytPlayerByHainee.removeEventListener("onStateChange", ytLoopFunctionByHainee);');
		script.appendChild(scriptText);

		//clearing interval variable if it was set
		scriptText = doc.createTextNode("window.clearInterval(loopIntervalByHainee);");
		script.appendChild(scriptText);

		//check if video is in playlist
		scriptText = doc.createTextNode("(" + this.checkPlaylistByHainee + ")();");
		script.appendChild(scriptText);

		doc.head.appendChild(script);
		doc.head.removeChild(script);
	},

	//if video is in playlist, disable button
	//cause video can't be replayed
	checkPlaylistByHainee: function() {
		if (ytPlayerByHainee.getPlaylistIndex() >= 0) {
			var ytLoopButton = document.getElementById("ytp-loop-button-by-hainee");
			ytLoopButton.setAttribute("data-tooltip-text", "Can't loop video from playlist");
			ytLoopButton.setAttribute("onclick", "");
		};
	},

	//insert button and script into page
	insertYtloopByHainee: function() {
		var doc = content.document;

		//insert script only if it's not there already
		if (! (doc.getElementById("yt-loop-script-by-hainee")) ) {
			doc.head.appendChild(this.createYtloopScriptByHainee(doc));
		};

		//insert button only if it's not there already
		if (! (doc.getElementById("ytp-loop-button-by-hainee")) ) {
			//insert button in buttons bar under video
			var buttonsBar = doc.getElementById("watch8-secondary-actions");
			if (buttonsBar) {
				var lastButton = buttonsBar.lastChild;
				var ytLoopButton = this.getYtloopButtonByHainee();

				if (lastButton)
					buttonsBar.insertBefore(ytLoopButton, lastButton);
				else
					buttonsBar.appendChild(ytLoopButton);
			};

			//set variables
			ytLoopExtensionByHainee.setYtloopVariablesByHainee(doc);
		};
	},

	//function to run on "loop" button click
	onclickYtloopButtonByHainee: function onclickYtloopButtonByHainee(loopButton) {

		var loop = loopButton.getAttribute("loop");

		//this attribute tells us current state of button
		if (loop == "true") {
			//set opposite state
			setButtonState("false", "Not looping", "inline-block", "none");

			//clear window interval if player is flash
			if(isPlayerFlashByHainee) {
				window.clearInterval(loopIntervalByHainee);
			}
			//remove loop listener if player is html5
			else {
				ytPlayerByHainee.removeEventListener("onStateChange", ytLoopFunctionByHainee);
			};
		}
		else {
			//set opposite state
			setButtonState("true", "Looping", "none", "inline-block");
			
			//set window interval function if player is flash
			if(isPlayerFlashByHainee) {
				loopIntervalByHainee = window.setInterval(function() {
					ytLoopFunctionByHainee(ytPlayerByHainee.getPlayerState());
				}, 1000);
			}
			//set loop listener if player is html5
			else {
				ytPlayerByHainee.addEventListener("onStateChange", ytLoopFunctionByHainee);

				//execute loop function immediately (in case if video is stopped already)
				ytLoopFunctionByHainee(ytPlayerByHainee.getPlayerState());
			};
		};

		//change button attributes to show new state
		function setButtonState(isLooping, text, noLoopImgDisplay, loopImgDisplay) {
			var doc = loopButton.ownerDocument;
			loopButton.setAttribute("data-tooltip-text", text);
			loopButton.setAttribute("loop", isLooping);
			doc.getElementById("ytp-loop-text-by-hainee").innerHTML = text;
			doc.getElementById("yt-loop-button-by-hainee-noloop-img").style.display = noLoopImgDisplay;
			doc.getElementById("yt-loop-button-by-hainee-loop-img").style.display = loopImgDisplay;
		};
	},

	//loop function itself
	ytLoopFunctionByHainee: function ytLoopFunctionByHainee(state) {
		if (state == 0) {
			ytPlayerByHainee.playVideo();
		};
	},

    onPageLoad: function(aEvent) {
        var doc = aEvent.originalTarget; // doc is document that triggered the event

        // only documents
        if (doc.nodeName != "#document") return;
        //only youtube video pages
        if (!(doc.location.href.match(/(http|https).*youtube.*watch/i))) return;
        //only current pages
        if (doc.location.href != content.location.href) return;

        //add loop button and script on page
        ytLoopExtensionByHainee.insertYtloopByHainee();
    }
};

window.addEventListener("load", function() {
    window.removeEventListener("load", this, false); //remove listener, no longer needed
    if (gBrowser) gBrowser.addEventListener("load", ytLoopExtensionByHainee.onPageLoad, true);
}, false);