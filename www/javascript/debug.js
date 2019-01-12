function loadPage() {
  var info = getDebugInfo();

  // Display the information
  $("#debug_info").text(JSON.stringify(info, null, 2));

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

  data.screen = {
    y: "yes",
    width: window.screen.width,
    height: window.screen.height,
    devicePixelRatio: window.screen.devicePixelRatio
  };

  /*
  data.device = window.device;
  */

  data.network = {
    y: "yes",
    type: navigator.connection.type,
    effectiveType: navigator.connection.effectiveType
  }

  return data;
}
