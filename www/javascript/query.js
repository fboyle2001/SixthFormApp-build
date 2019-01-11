function query(url, postData, callback, fatal) {
  // Don't allow queries if not logged in
  if(!isLoggedIn()) {
    var response = {
      "status": {
        "code": 401,
        "description": "User is not logged in"
      },
      "content": {}
    };

    fatal(response);
    return;
  }

  // Query the page with the necessary auth token
  $.ajax({
    url: Cookies.get("base") + url,
    type: "post",
    dataType: "json",
    data: postData,
    headers: {
      authorization: Cookies.get("auth")
    },
    success: function(data) {
      callback(data);
    },
    error: function(xhr, text, thrown) {
      // Check if user changed page before it loaded
      if(!xhr.getAllResponseHeaders()) {
        return;
      }

      fatal(xhr);
    }
  });
}

// Opens a link in the browser
function openInBrowser(url) {
  if(typeof cordova !== "undefined" && typeof cordova.InAppBrowser !== "undefined") {
    cordova.InAppBrowser.open(url, "_system");
  } else {
    window.open(url, "_blank");
  }
}

// Handles Android problem with PDFs whilst leaving iOS alone
function openFileInBrowser(url) {
  if(window.cordova.platformId === "android") {
    url = "https://docs.google.com/viewerng/viewer?url=" + url.replace("&", "%26");
  }

  openInBrowser(url);
}

// Send alerts to the user's device as pop ups
function sendAlert(message, title = "Alert", button = "OK") {
	if(typeof navigator.notification !== "undefined") {
		navigator.notification.alert(message, null, title, button);
	} else {
		alert(message);
	}
}

// Checks password meets minimum standard
function doesPasswordMeetStandard(password) {
  if(password == null) {
    return "You must enter a password.";
  }

  if(password == "") {
    return "You must enter a password.";
  }

  if(password.length < 8) {
    return "Your password must be at least 8 characters long.";
  }

  if(/[0-9]+/.test(password) == false) {
    return "Your password must contain at least one number.";
  }

  if(/[a-z]+/.test(password) == false) {
    return "Your password must contain at least one lowercase letter.";
  }

  if(/[A-Z]+/.test(password) == false) {
    return "Your password must contain at least one uppercase letter.";
  }

  return true;
}

// Checks if user is logged in
function isLoggedIn() {
  if(Cookies.get("auth") === undefined) {
    return false;
  }

  if(Cookies.get("base") === undefined) {
    return false;
  }

  return true;
}

// Verifies the user's accounts
function verifyUser(start, fatal) {
  if(Cookies.get("auth") === undefined) {
    return fatal("You are not logged in.");
  }

  if(Cookies.get("base") === undefined) {
    return fatal("You are not logged in.");
  }

  if(Cookies.get("expire") === undefined) {
    query("/accounts/details/", {}, function (data) {
      var code = data["status"]["code"];
      var expireTime = data["content"]["expire"];

      if(code == 200) {
        Cookies.set("expire", expireTime, {expires: 1/24});
        start();
      } else {
        fatal("Session has expired.");
      }
    }, function (data) {
      fatal("Unable to locate server.");
    });
  } else {
    var expireTime = Cookies.get("expire");
    var currentTime = Math.floor(Date.now() / 1000);

    if(expireTime > currentTime) {
      start();
    } else {
      fatal("Session has expired.");
    }
  }
}

function clearStorage() {
  if(typeof(Storage) !== "undefined") {
    localStorage.clear();
  }
}

function retrieveContent(key) {
  if(typeof(Storage) !== "undefined") {
    return localStorage.getItem(key);
  }

  return false;
}

function cacheContent(key, content) {
  if(typeof(Storage) !== "undefined") {
    localStorage.setItem(key, content);
  }
}

var push = {
  setup: function() {
    if(typeof PushNotification === 'undefined') {
      console.log("Push does not exist");
      console.log("yea");
      sendAlert("NO PN");
      return;
    }

    var push = PushNotification.init({
      "android": {
        "senderID": "1078065604665"
      },
      "browser": {},
      "ios": {
        "sound": true,
        "vibration": true,
        "badge": true
      },
      "windows": {}
    });

    localStorage.removeItem("registrationId");

    push.on('registration', function(data) {
      sendAlert("At registration stage");
      var old = localStorage.getItem("registrationId");
      sendAlert(old);

      if(old !== data.registrationId) {
        // New ID
        localStorage.setItem("registrationId", data.registrationId);
        // Send it to the server

        query("/push/register/", {deviceId: data.registrationId}, function(data) {
          sendAlert("Registered");
        }, function(data) {
          sendAlert("Unable to register");
        });
      }
    });

    push.on('notification', function(data) {
      navigator.notification.alert(
        data.message,
        null,
        data.title,
        'OK'
      );
    });
  }
}

// When the device has loaded this is run
function onDeviceReady() {
  push.setup();

  $(document).ready(function () {
    verifyUser(function () {
      loadPage();
    }, function(err) {
      window.location = "index.html";
    });
  });
}

// When the app has been reloaded this is run
function onResume() {
  verifyUser(function () {
    return;
  }, function (err) {
    window.location = "index.html";
  });
}

// Cordova event listeners
document.addEventListener("resume", onResume, false);
document.addEventListener("deviceready", onDeviceReady, false);
