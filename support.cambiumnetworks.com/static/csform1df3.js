$(document).ready(function() {
  function progressify(el) {
    var $el = $(el);
    $el.addClass("cs-in-progress");
  }

  $("form.cs-with-progress, .cs-with-progress form").on("submit", function(e) {
    var $form = $(e.target);
    if ($form.data("submitting")) {
      return false;
    }
    var $button = $form.find("button[type='submit']");
    progressify($button.get(0));
    $form.data("submitting", true);
    return true;
  });

  var linkselector = "a.cs-with-progress, button.cs-with-progress";
  $(linkselector).on("click", function(e) {
    var $link = $(e.target).closest(linkselector);
    progressify($link.get(0));
    return true;
  });

  $(window).on("pageshow", function(e) {
    $(".cs-in-progress").removeClass("cs-in-progress");
    $("form.cs-with-progress, .cs-with-progress form").data(
      "submitting", false
    );
  });

  var zeropad = function(s, l) {
    s = s.toString();
    while (s.length < l) {
      s = "0" + s;
    }
    return s;
  };

  var formatCodes = {
    "%Y": function(d) { return d.getFullYear(); },
    "%m": function(d) { return zeropad(d.getMonth() + 1, 2); },
    "%d": function(d) { return zeropad(d.getDate(), 2); },
    "%H": function(d) { return zeropad(d.getHours(), 2); },
    "%M": function(d) { return zeropad(d.getMinutes(), 2); },
    "%S": function(d) { return zeropad(d.getSeconds(), 2); },
    "%%": function(d) { return "%"; },
  };

  var formatDate = function(d, format) {
    return format.replace(/%./g, function(match) {
      var replacer = formatCodes[match] || function() { return match; };
      return replacer(d);
    });
  };

  var getDateStrings = function(seconds, format) {
    var ms = seconds * 1000;
    var d = new Date(ms);
    var fullString = formatDate(d, format);
    var now = new Date().valueOf();
    var deltaseconds = (now - ms) / 1000;
    var friendly;
    if (deltaseconds < 0) {
      // in the future
      friendly = fullString;
    } else if (deltaseconds < (60 * 2)) {
      friendly = "just now";
    } else if (deltaseconds < (60 * 60)) {
      friendly = Math.round(deltaseconds / 60) + " minutes ago";
    } else {
      friendly = fullString;
    }
    return {
      "friendly": friendly,
      "full": fullString,
    };
  };

  var localiseTimestamp = function(element) {
    var seconds = parseInt(element.dataset.value);
    if (isNaN(seconds)) {
      return false;
    }
    var format = element.dataset.format || "%Y-%m-%d %H:%M:%S";
    var strings = getDateStrings(seconds, format);
    element.setAttribute("title", strings.full);
    element.innerText = strings.friendly;
    // return true if the strings are different (meaning they will go
    // stale and need to be updated again)
    return (strings.full != strings.friendly);
  };

  var localiseAllTimestamps = function() {
    var runAgain = false;
    $("span.ts").each(function(i, e) {
      runAgain |= localiseTimestamp(e);
    });
    if (runAgain) {
      window.setTimeout(localiseAllTimestamps, 60 * 1000);
    }
  };
  localiseAllTimestamps();
});
