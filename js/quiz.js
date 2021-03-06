// Generate times table quizzes based on level selection
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
    // Change "See full table" link to the current level
    $("#table-link").attr("href", "table.html?level=" + this.value);
  });

  // Generate default quiz on load
  $("#level-select").trigger("change");
});