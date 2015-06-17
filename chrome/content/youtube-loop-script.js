var ytLoopExtensionByHainee = {

	//experiment function only
	
	// ytLoopByHaineeToolbarCommand: function() {
	// 	var url = content.location.href;
	// 	if (url.match(/youtube.*watch/i)) {
	// 		this.insertYtloopByHainee();
	// 	};
	// },

	//clone button from .xul overlay
	getYtloopButtonByHainee: function() {
		return document.getElementById("ytp-loop-button-by-hainee").cloneNode();
	},

	//create script from "onclickYtloopButtonByHainee" function
	createYtloopScriptByHainee: function(doc) {
		var script = doc.createElement("SCRIPT");	
		var scriptText = doc.createTextNode(this.onclickYtloopButtonByHainee);	
		script.appendChild(scriptText);
		script.setAttribute("id", "ytp-loop-script-by-hainee");
		return script;
	},

	//insert button and script into page
	insertYtloopByHainee: function() {
		var doc = content.document;
		var buttonsBar = doc.getElementsByClassName("html5-player-chrome")[0];
		if (buttonsBar)
			buttonsBar.appendChild(this.getYtloopButtonByHainee());
		doc.head.appendChild(this.createYtloopScriptByHainee(doc));
	},

	//function to run on "loop" button click
	onclickYtloopButtonByHainee: function onclickYtloopButtonByHainee(loopButton) {
		//var videoPlayer = loopButton.ownerDocument.getElementsByTagName("video")[0];
		var player = loopButton.ownerDocument.getElementById("movie_player");

		var isLooping = loopButton.getAttribute("loop");
		if (isLooping == "true") {
			loopButton.style.backgroundPosition = "center top";	
			loopButton.setAttribute("data-tooltip-text", "Not looping");
			loopButton.setAttribute("loop", "false");
			//videoPlayer.removeAttribute("loop");
			player.removeEventListener("onStateChange", loop);

		}
		else {
			loopButton.style.backgroundPosition = "center bottom";
			loopButton.setAttribute("data-tooltip-text", "Looping");
			loopButton.setAttribute("loop", "true");
			//videoPlayer.setAttribute("loop", "true");
			player.addEventListener("onStateChange", loop);
		};

		function loop(state) {
			if (state == 0) {
				player.playVideo();				
			};
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

        //if there is already button on page - give it "not looping" state
        var button = content.document.getElementById("ytp-loop-button-by-hainee");
        if (button) {
        	if (button.getAttribute("loop") == "true") button.click();
        	return;
        };

        //add loop button and script on page
        ytLoopExtensionByHainee.insertYtloopByHainee();
    }
};

window.addEventListener("load", function() {
    window.removeEventListener("load", this, false); //remove listener, no longer needed
    if (gBrowser) gBrowser.addEventListener("load", ytLoopExtensionByHainee.onPageLoad, true);
}, false);