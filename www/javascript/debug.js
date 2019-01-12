function loadPage() {
  var info = getDebugInfo();

  // Display the information
  $("#debug_info").text(JSON.stringify(info, null, 2));

  $("#a").text("Conn exist: " + (typeof navigator.connection == "undefined")  + " Conn Type: " + JSON.stringify(navigator.connection));
  $("#b").text("WS exist: " + (typeof window.screen == "undefined")  + " WS Type: " + JSON.stringify(window.screen));
  $("#c").text("WD exist: " + (typeof window.device == "undefined")  + " WD Type: " + JSON.stringify(window.device));
  $("#d").text("WPD exist: " + (typeof window.plugins.device == "undefined")  + " WD Type: " + JSON.stringify(window.plugins.device));

  // Hide or show the information
  $("#debug_toggle").click(function (e) {
    e.preventDefault();

    if($("#debug_info").is(":hidden")) {
      $("#debug_info").slideDown();
    } else {
      $("#debug_info").slideUp();
    }
  })

  // Copy the debug information
  $("#debug_copy").click(function (e) {
    e.preventDefault();
    cordova.plugins.clipboard.copy(JSON.stringify(info), function(s) {
      alert("s: " + s);
    }, function(s) {
      alert("f: " + s);
    });
  });
}

function getDebugInfo() {
  var data = {};

  data.settings = getUserSettings();

  var cache = {};

  $.each(Object.keys(localStorage), function(_, key) {
    cache[key] = JSON.parse(localStorage.getItem(key));
  });

  data.cache = cache;
  data.cookies = Cookies.get();

  data.device = JSON.stringify(window.device);

  data.screen = JSON.stringify({
    width: window.screen.width,
    height: window.screen.height,
    devicePixelRatio: window.screen.devicePixelRatio
  });

  data.network = JSON.stringify({
    type: navigator.connection.type,
    effectiveType: navigator.connection.effectiveType
  });

  return data;
}
