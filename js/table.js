// Generate times tables based on level selection
$(function() {
  // Set default level based on url parameter "level"
  var defaultLevel = new URLSearchParams(window.location.search).get("level");
  // Check if "level" is a valid option
  $("#level-select option").each(function() {
    if (defaultLevel == this.value) {
      $("#level-select").val(defaultLevel);
    }
  });

  $("#level-select").on("change", function() {
    $("div.times-table-container").html(generate_times_table(this.value, this.value));
    // Change "Go to quiz" link to the current level
    $("#quiz-link").attr("href", "quiz.html?level=" + this.value);
  });

  // Generate default table on load
  $("#level-select").trigger("change");
});