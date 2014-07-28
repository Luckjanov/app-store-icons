// Data section
var itunes_link = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsLookup?country=';
var itunes_link_id_attribute = '&id=';
var app_name;
var img_url;
var app_link;
var target = document.getElementById('foo');
function get_id(apps_link)
{
  Pace.start()
  var regex_id = /(id)([\d]+)/;
  apps_link = apps_link.match(regex_id)
  if(apps_link == null) return;
  return apps_link[2]
}

function get_lang(app_link)
{
  var regex_lang = /com\/(.+)\/app\//;
  var lang = app_link.match(regex_lang);
  lang = (!lang) ? 'us' : lang[1];
  return (lang == 'en') ? 'us' : lang;
}

function draw_content()
{
  if($('#itunes-link').val() != app_link) {$('#itunes-link').val(app_link);}
  $('#star').attr('src', img_url);
  $('#star').attr('alt', app_name);
  window.document.title = app_name;

  $('#star').load(function() // Icon is loaded
  {
    // Setting icon's corners
    var img = document.getElementById('star');
    var width = img.clientWidth;
    if(width == 1024) border_radius = 180;
    else if(width == 512) border_radius = 90;
    $(this).css('-webkit-border-radius', border_radius);
    $(this).css('-moz-border-radius', border_radius);
    $(this).css('border', '1px solid');
  });

}

function load_content()
{
  var app_id = get_id(app_link);
  var lang = get_lang(app_link);

  if(!app_id) return;
  var request_link = itunes_link + lang + itunes_link_id_attribute + app_id;
  $.getJSON(request_link + '&callback=?', function(json) 
  {
    // There is no such app
    if (json.resultCount == 0 || json.results[0].kind != 'software') { return;}

    json = json.results
    img_url = json[0].artworkUrl100;

    // App hasn't big icon.
    if(!img_url) return;

    // Icon of app is .tif
    if(img_url.match(/tif$/)) return;
    app_name = json[0].trackName;
    draw_content();
    state_of_page = {app_link: app_link, img_url: img_url, app_name: app_name};
    Pace.stop()
  });
}

$().ready(function () {
  // If url isn't virgin
  var virgin_pattern_id = /[\d]+$/;
  var virgin_pattern_lang = /\/([\w]+)\//;
  var current_id = location.href;
  var current_lang = location.href;
  current_id = current_id.match(virgin_pattern_id);
  current_lang = current_lang.match(virgin_pattern_lang);
  if(current_lang && current_id)
  {
    app_link = 'https://itunes.apple.com/' + current_lang[1] + '/app/id' + current_id
    load_content(app_link);
    reload = true;
  }

  // Monitoring changes in text-field
  $('#itunes-link').bind('textchange', function ()
  {
    app_link = $(this).val();
    load_content(app_link);    
  });

  // Select text-field value after click
  $('input[type=text]').click(function() {$(this).select();});
});

window.addEventListener('popstate', function(event) {
  if(!event.state && !reload)
  {
    app_link = "";
    img_url = "blue-print.png";
    app_name = "Посмотреть иконку";
  }
  else
  {
    app_link = event.state.app_link;
    img_url = event.state.img_url;
    app_name = event.state.app_name;
  }
  draw_content();
  reload = false;
});