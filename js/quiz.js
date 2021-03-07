var quizController;

function getLevel() {
  return parseInt($("#select-level").val());
}

function getQuizSize() {
  return parseInt($("#select-quiz-size").val());
}

function getQuizMinFactor() {
  return parseInt($("#select-quiz-min-factor").val());
}

/**
 * Initialize quiz based on current page settings
 */
function initQuizDefault() {
  var quiz = new TimesTableQuiz(getLevel(), getQuizSize(), getQuizMinFactor());
  quizController = new TimesTableQuizController(
    quiz,
    "quiz-output",
    "quiz-comment",
    "quiz-input",
    "quiz-enter",
    "quiz-progress"
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
  $("#select-quiz-size").on("change", function() {
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