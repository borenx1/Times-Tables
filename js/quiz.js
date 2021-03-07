/**
 * Initialize quiz based on current page settings
 */
 function initQuizDefault() {
  initQuiz(
    $("#select-quiz-number").val(),
    $("#select-quiz-min-factor").val(),
    "quiz-output",
    "quiz-input",
    "quiz-enter"
  );
}

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
    // Update quiz setting "Minimum factor" select options
    fillQuizMinFactorSelect(this.value, "select-quiz-min-factor");
    // Reset quiz on change level
    initQuizDefault();
  });
  
  //// Implement quiz functionality
  // Reset quiz on change settings
  $("#select-quiz-number").on("change", function() {
    initQuizDefault();
  });
  $("#select-quiz-min-factor").on("change", function() {
    initQuizDefault();
  });
  $("#button-quiz-reset").on("click", function() {
    initQuizDefault();
  });

  //// Generate default quiz on load
  $("#select-level").trigger("change");
});