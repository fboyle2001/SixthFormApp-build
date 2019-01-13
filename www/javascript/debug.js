function loadPage() {
  var info = getDebugInfo();

  // Display the information
  $("#debug_info").text(JSON.stringify(info, null, 2));

  if(typeof navigator === undefined) {
    $("#a").text("Nav is undefined");
  } else {
    $("#a").text("Nav is defined");
  }

  if(typeof window === undefined) {
    $("#b").text("Window is undefined");
  } else {
    $("#b").text("Window is defined");
  }
  
  if(typeof screen === undefined) {
    $("#f").text("Window is undefined");
  } else {
    $("#f").text("Window is defined");
  }

  var conn = navigator.connection || {exists: "none"};
  conn = JSON.stringify(conn);

  $("#c").text("Conn: " + conn);

  var devi = window.device || {exists: "none"};
  devi = JSON.stringify(devi);

  $("#d").text("Devi: " + devi);

  $("#e").text("S: " + window.innerWidth + " b " + window.innerHeight);

  var screen

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
    cordova.plugins.clipboard.copy(JSON.stringify(info), null, null);
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
  data.device = {
    platform: window.device.platform,
    version: window.device.version,
    cordova: window.device.cordova,
    model: window.device.model,
    manufacturer: window.device.manufacturer
  };

  data.connection = {
    type: navigator.connection.type
  };

  return data;
}
