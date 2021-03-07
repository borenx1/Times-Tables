// Generate times table quizzes based on level selection
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
    // Change "See full table" link to the current level
    $("#table-link").attr("href", "table.html?level=" + this.value);
  });

  // Generate default quiz on load
  $("#select-level").trigger("change");
});