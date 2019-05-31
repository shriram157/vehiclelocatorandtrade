document.head || (document.head = document.getElementsByTagName('head')[0]);

function changeFavicon(src) {
	var link = document.createElement('link');
	//oldLink = document.getElementById('dynamic-favicon');
	//link.id = 'dynamic-favicon';

	link.type = "image/png";

	link.rel = 'shortcut icon';
	link.href = src;
	//if (oldLink) {
	// document.head.removeChild(oldLink);
	//}
	document.head.appendChild(link);

	

}

var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);

if (isDivisionSent) {
	this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

	if (this.sDivision == "10") {
		changeFavicon("Images/favicon-16x16.png");
	} else if (this.sDivision == "20") {
		changeFavicon("Images/faviconL-32x32.png");
	} else {
		changeFavicon("Images/favicon-16x16.png");
	}

} else {
	changeFavicon("Images/favicon-16x16.png");
}

var isLanguageSent = window.location.search.match(/language=([^&]*)/i);
if (isLanguageSent) {
	var isLanguageSent = window.location.search.match(/language=([^&]*)/i)[1];
} else {
	var isLanguageSent = "en"; // default is english 

}

if (isLanguageSent == 'fr') {
 var currentText = document.getElementById('oTitleText');
	 currentText.text = "Localisateur et échange de véhicule";
 
}
