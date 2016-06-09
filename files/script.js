// Entry point:
$().ready(function () {
  parse_url(); //does current url contain app id? if so show icon.

  // Monitoring changes in text-field
  $('#itunes-link').bind('textchange', function () {
    load_content( $(this).val() );    
  });

  // Select text-field value after click
  $('input[type=text]').click(function() {$(this).select();});
});

// HELPERS:
function get_id(id_source) {
  var regex_id = /(id)([\d]+)/;
  result = id_source.match(regex_id)
  if(result == null) {
    return null;
  }
  return result[2]
}

function get_lang(lang_source) {
  var regex_lang = /com\/(.+)\/app\//;
  var lang = lang_source.match(regex_lang);
  lang = (!lang) ? 'us' : lang[1];
  return (lang == 'en') ? 'us' : lang;
}

function icon1024(small_size_url) {
  jpg_pattern = /(.+)(512x512bb.jpg)/;
  base_part = small_size_url.match(jpg_pattern);
  url_1024_size = base_part[1] + "1024x1024bb.jpg";
  return url_1024_size;
}

function parse_url(){
  var virgin_pattern_id = /[\d]+$/;
  var virgin_pattern_lang = /\/([\w]+)\//;
  var current_id = current_lang = location.href;
  console.log("current_id: " + current_id);
  current_id = current_id.match( virgin_pattern_id );
  current_lang = current_lang.match( virgin_pattern_lang );
  if(current_lang && current_id) {
    load_content( 'https://itunes.apple.com/' + current_lang[1] + '/app/id' + current_id );
  }  
}

function load_content(app_link) {
  var itunes_link = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsLookup?country=';
  var itunes_link_id_attribute = '&id=';

  var app_id = get_id(app_link);
  if(!app_id) {
    console.log("Can't find id in provided URL.");
    return;
  }
  var lang = get_lang(app_link);

  var request_link = itunes_link + lang + itunes_link_id_attribute + app_id;
  $.getJSON(request_link + '&callback=?', function(json) {
    // console.log("start request to " + request_link);
    // There is no such app
    if (json.resultCount == 0 || json.results[0].kind != 'software') { return;}
    // console.log("response: " + JSON.stringify(json));

    json = json.results
    img_url = json[0].artworkUrl512; // It's max size of image available im file, but...

    // App hasn't icon.
    if(!img_url) {
      console.log("Can't find image link.");
      return;
    }

    img_url = icon1024(img_url);

    if(img_url.match(/tif$/)) { // code block will never be executed
      console.log("Icon of app is .tif format");
      return;
    }
    app_name = json[0].trackName;
    draw_content(app_name, img_url);
  });
}

function draw_content(screen_title, image_url) {
  $('#star').attr('src', image_url);
  $('#star').attr('alt', screen_title);
  window.document.title = screen_title;

  $('#star').load(function() { // Icon is loaded 
    // Setting icon border
    var img = document.getElementById('star');
    if(img.clientWidth == 1024) {
      border_radius = 180;
    }
    else if(img.clientWidth == 512) {
      border_radius = 90;
    }
    $(this).css('border', '1px solid');
    $(this).css('border-radius', border_radius + 'px');
  });
}