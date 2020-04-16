//SHOW NAVBAR ON SCROLL

let timer;

$(window).on('scroll', function () {
	$('nav').addClass('show-navbar');
	try {
		clearTimeout(timer);
	} catch (e) {}
	timer = setTimeout(function () {
		$('nav').removeClass('show-navbar');
	}, 1500);
});

//TOOLTIPS

$(function () {
	$(document).tooltip({
		tooltipClass: 'uitooltip',
		track: true,
	});
});
