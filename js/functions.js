$(document).ready(function() {
  console.log("functions.js loaded");
  // Load navbar on pages with ".navbar-container"
  let navbarContainer = $(".navbar-container");
  navbarContainer.load("common/navbar.html", function() {
    // Get the last item in the path (to be able to host on GitHub Pages)
    var path = window.location.pathname.split("/").slice(-1)[0];
    switch (path) {
      case "index.html":
      case "": {
        $("#nav-home").addClass("active");
        break;
      }
      case "table.html": {
        $("#nav-table").addClass("active");
        break;
      }
      case "times-table-quiz.html": {
        $("#nav-quiz-times-table").addClass("active");
        $("#nav-quiz").addClass("active");
        break;
      }
      case "times-table-single-quiz.html": {
        $("#nav-quiz-single").addClass("active");
        $("#nav-quiz").addClass("active");
        break;
      }
      case "quiz.html": {
        $("#nav-quiz").addClass("active");
        break;
      }
      default: {
        console.warn("No active navbar link for path: " + path);
      }
    }
  });
});