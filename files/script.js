var opts = {
	lines: 10, // The number of lines to draw
	length: 4, // The length of each line
	width: 1, // The line thickness
	radius: 5, // The radius of the inner circle
	corners: 0, // Corner roundness (0..1)
	rotate: 0, // The rotation offset
	color: '#000', // #rgb or #rrggbb
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: 'auto', // Top position relative to parent in px
	left: 'auto' // Left position relative to parent in px
};

$().ready(function () {
$('.itunes-link').bind('textchange', function () {
var app = $(this).val();
var regex_id = /id[\d]+/;
var app_id = app.match(regex_id);
var app_id = app.match(/[\d]+/);
if(app_id)
{
var target = document.getElementById('spin-loader');
var spinner = new Spinner(opts).spin(target);
var lang1 = "ru", lang2 = "us";
var request_link = "http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsLookup?country=" + lang1 + "&id=" + app_id;
$.getJSON(request_link + '&callback=?', function(json) {
if (json.resultCount == 0) spinner.stop();
json = json.results
img_url = json[0].artworkUrl100;
$('#star').attr('src', img_url);
$('#star').attr('alt', json[0].trackName);
	$('#star').load(function() {
		spinner.stop();

		/* Радиус уголка в зависимости от размера иконки */
		var img = document.getElementById('star');
		var width = img.clientWidth;
		if(width == 1024)
			{var st = 180;}
		else if(width == 512)
			{var st = 90;}
		$(this).css("-webkit-border-radius", st);
		$(this).css("-moz-border-radius", st);
		$(this).css("border-radius", st);
	});});}});
$('input[type=text]').click(function() {
$(this).select();
});
});