//FADE IN IMAGE

var image = document.querySelector('#destination-image');

window.onscroll = function () {
	if (window.scrollY > 250) {
		image.classList.add('showImage');
	} else {
		image.classList.remove('showImage');
	}
};
