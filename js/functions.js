$(document).ready(function() {
  console.log("functions.js loaded");
});

/**
 * Return a random integer between min and max inclusive.
 * @param {number} min Minimum integer.
 * @param {number} max Maximum interger.
 * @returns A random integer between min and max inclusive.
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates and returns a times table.
 * @param {number} rowMax Maximum row number.
 * @param {number} colMax Maximum column number.
 * @param {number} rowMin Minimum row number. Defaults to 1.
 * @param {number} colMin Minimum column number. Defaults to 1.
 * @returns A jQuery table object.
 */
function generateTimesTable(rowMax, colMax, rowMin = 1, colMin = 1) {
  console.log("Generate " + rowMax + " x " + colMax + " times table");
  var table = $("<table/>");
  var tableRows = [];
  for (let i = rowMin; i <= rowMax; i++) {
    let rowItems = ["<tr>"];
    for (let j = colMin; j <= colMax; j++) {
      let number = i * j;
      // Use table header <th/> if first row or column, else <td/>
      let cell = (i == rowMin || j == colMin) ? "<th>" + number + "</th>" : "<td>" + number + "</td>";
      rowItems.push(cell);
    }
    rowItems.push("</tr>");
    tableRows.push(rowItems.join(""));
  }

  table.html(tableRows.join(""));

  return table
}

/**
 * Fill the "Minimum factor" quiz setting select element based on the selected level.
 * @param {number} level The times table level
 * @param {string} selectId The id of the "Minimum factor" select element
 */
function fillQuizMinFactorSelect(level, selectId) {
  var select = $("#" + selectId);
  var currentMinFactor = select.val();
  // Try to keep the current selected "min factor".
  // Reset "min factor" to 2 if the new level is less than the current "min factor" (min factor <= level).
  var newMinFactor = currentMinFactor > level ? 2 : currentMinFactor;
  
  var options = [];
  for (let i = 1; i <= level; i++) {
    if (i == newMinFactor) {
      options.push(`<option value="${i}" selected>${i}</option>`);
    } else {
      options.push(`<option value="${i}">${i}</option>`);
    }
  }

  select.html(options.join(""));
}

/**
 * Initialize the times table quiz given settings and HTML components.
 * @param {number} level The level of the quiz (level x level times table).
 * @param {number} size How many questions in the quiz (0 for unlimited).
 * @param {number} minFactor The minimum factor (multiple) of the questions.
 * @param {string} outputId The id of the question output element.
 * @param {string} commentId The id of the comment output element.
 * @param {string} inputId The id of the input element.
 * @param {string} enterButtonId The id of the enter button.
 * @param {string} progressId The id of the progress display element.
 */
function initQuiz(level, size, minFactor, outputId, commentId, inputId, enterButtonId, progressId) {
  console.log(`Initialize quiz; level: ${level}, size: ${size}, min factor: ${minFactor}`);
  var output = $("#" + outputId);
  var comment = $("#" + commentId);
  var input = $("#" + inputId);
  var enterButton = $("#" + enterButtonId);
  var progressOutput = $("#" + progressId);

  // Init quiz variables
  /** 0 for showing question, 1 for showing answer, 2 for showing results, 3 for finished. */
  var state;
  var progress;
  var correctAnswers;
  var factor1;
  var factor2;

  function updateProgress() {
    progress += 1;
    let progressText = size == 0 ? `Question ${progress}` : `Question ${progress}/${size}`;
    progressOutput.text(progressText);
  }

  function checkAnswer() {
    return parseInt(input.val()) === factor1 * factor2;
  }

  function nextQuestion() {
    input.val("");
    comment.text("");
    factor1 = randomInt(minFactor, level);
    factor2 = randomInt(minFactor, level);
    output.text(`${factor1} × ${factor2}`);
    updateProgress();
    state = 1;
  }

  function showAnswer() {
    if (checkAnswer()) {
      comment.text("Correct!");
      correctAnswers += 1;
    } else {
      comment.text(`Wrong! The answer is ${factor1 * factor2}!`);
    }
    // Check if the quiz is completed to decide whether to end or go to next question
    state = (size != 0 && progress >= size) ? 2 : 0;
  }

  function showResults() {
    output.text(`${correctAnswers}/${size} (${(correctAnswers/size*100).toFixed(1)}%)`);
    comment.text("Reset quiz to try again");
    state = 3;
  }

  function restart() {
    state = 0;
    progress = 0;
    correctAnswers = 0;
    nextQuestion();
  }

  // Reattach handlers
  enterButton.off("click");
  enterButton.on("click", function() {
    if (state == 0) {
      nextQuestion();
    } else if (state == 1) {
      showAnswer();
    } else if (state == 2) {
      showResults();
    } else if (state == 3) {
      // Quiz completed, no action
    } else {
      console.warn("Unknown state: " + state);
    }
    input.focus();
  });

  input.off("keydown");
  input.on("keydown", function(e) {
    if (e.keyCode === 13) {
      enterButton.trigger("click");
    }
  })

  // Start first question
  restart();

  // Set focus to the input in the end for convenience
  input.focus();
}