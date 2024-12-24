(function ($) {
  "use strict";

  // Function to set sidebar height
  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  // Toggle between icon-only and icon-with-text modes
  $("#toggleIcons").on("click", function () {
    $("#sidebar").toggleClass("icon-only");
  });

  // Fully hide the sidebar and show the "Show Sidebar" button
  $("#hideSidebar").on("click", function () {
    $("#sidebar").addClass("hidden");
    $("#showSidebar").css("display", "block");
    $("#hideSidebar").css("display", "none");
    $("#toggleIcons").css("display", "none");
    $("#content").css("width", "100vw");
  });

  // Show the sidebar when it is fully hidden
  $("#showSidebar").on("click", function () {
    $("#sidebar").removeClass("hidden");
    $("#showSidebar").css("display", "none");
    $("#hideSidebar").css("display", "block");
    $("#toggleIcons").css("display", "block");
    $("#content").css("width", "94%");

  });

  // Sidebar collapse functionality to adjust content width
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");

    if ($("#sidebar").hasClass("active")) {
      $("#content").css("width", "94%");
    } else {
      $("#content").css("width", "calc(100% - 270px)");
    }
  });
})(jQuery);
