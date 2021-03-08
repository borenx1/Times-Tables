// Generate times tables based on level selection
$(function() {
  // Set default level based on url parameter "level"
  var defaultLevel = new URLSearchParams(window.location.search).get("level");
  // Check if "level" is a valid option
  $("#select-level option").each(function() {
    if (defaultLevel == this.value) {
      $("#select-level").val(defaultLevel);
    }
  });

  $("#select-level").on("change", function() {
    $("#times-table-container").html(generateTimesTable(this.value, this.value));
    // Change "Go to quiz" link to the current level
    $("#quiz-link").attr("href", "quiz.html?level=" + this.value);
  });

  // Generate default table on load
  $("#select-level").trigger("change");
});