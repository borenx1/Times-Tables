$(document).ready(function() {
  console.log("functions.js loaded");
  // Load navbar on pages with ".navbar-container"
  $(".navbar-container").load("common/navbar.html", function() {
    // Get the last item in the path (to be able to host on GitHub Pages)
    var path = window.location.pathname.split("/").slice(-1)[0];
    if (path == "index.html" || path == "") {
      $("#nav-home").addClass("active");
    } else if (path == "table.html") {
      $("#nav-table").addClass("active");
    } else if (path == "quiz.html") {
      $("#nav-quiz").addClass("active");
    }
  });
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

/** The logic for the times table quiz. */
class TimesTableQuiz {
  /**
   * Constructor for a Times Table Quiz.
   * @param {number} level The level of the quiz (level x level times table).
   * @param {number} size How many questions in the quiz (0 for unlimited).
   * @param {number} minFactor The minimum factor (multiple) of the questions.
   */
  constructor(level, size, minFactor) {
    // Quiz settings
    this.level = level;
    this.size = size;
    this.minFactor = minFactor;
    // Init quiz variables
    this.progress;
    this.correctAnswers;
    this.factor1;
    this.factor2;
    this.restart();
    console.log("Initialize quiz");
  }

  restart() {
    this.progress = 0;
    this.correctAnswers = 0;
    this.nextQuestion();
  }

  nextQuestion() {
    this.factor1 = randomInt(this.minFactor, this.level);
    this.factor2 = randomInt(this.minFactor, this.level);
    this.progress += 1;
  }

  getAnswer() {
    return this.factor1 * this.factor2;
  }

  /**
   * Answers the question of factor1 * factor2. If the answer is correct, increment the
   * correctAnswers tally. Generates a new question (and increment the progress).
   * @param {number} answer Given answer of the question (factor1 * factor2)
   * @returns true if the answer is correct, else false.
   */
  answerQuestion(answer) {
    var correct = parseInt(answer) === this.getAnswer();
    if (correct) {
      this.correctAnswers += 1;
    }
    this.nextQuestion();
    return correct;
  }

  /**
   * Checks if the game is finished.
   * @returns true if the progress > the game size and the size is not 0 (unlimited), else false.
   */
  isFinished() {
    return this.size != 0 && this.progress > this.size;
  }
}

/** A controller for connecting a times table quiz to views. */
class TimesTableQuizController {
  /**
   * Constructor for a Times Table Quiz controller. The initial state depends on the given state of
   * the passed TimesTableQuiz object.
   * @param {TimesTableQuiz} quiz A TimesTableQuiz object.
   * @param {string} outputId The id of the question output element.
   * @param {string} commentId The id of the comment output element.
   * @param {string} inputId The id of the input element.
   * @param {string} enterButtonId The id of the enter button.
   * @param {string} progressId The id of the progress display element.
   */
  constructor(quiz, outputId, commentId, inputId, enterButtonId, progressId) {
    this.quiz = quiz;
    this.output = $("#" + outputId);
    this.comment = $("#" + commentId);
    this.input = $("#" + inputId);
    this.enterButton = $("#" + enterButtonId);
    this.progressOutput = $("#" + progressId);
    /** The current state: 0 for showing question, 1 for showing answer, 2 for showing results. */
    this.state;

    // Attach/Reattach event handlers
    this.enterButton.off("click");
    this.enterButton.on("click", () => this.enter());

    this.input.off("keydown");
    this.input.on("keydown", (e) => {
      // Key enter on input triggers button click
      if (e.keyCode === 13) {
        this.enterButton.trigger("click");
      }
    })

    // Initialize views
    this.showQuestion();
    console.log("Initialize controller");
  }

  enter() {
    if (this.state == 0) {
      this.showAnswer();
    } else if (this.state == 1) {
      // Check if the quiz is completed to decide whether to end or go to next question
      if (this.quiz.isFinished()) {
        this.showResults();
      } else {
        this.showQuestion();
      }
    } else if (this.state == 2) {
      // Restart quiz after quiz completed
      this.restart();
    } else {
      console.warn("Unknown state: " + this.state);
    }
    this.input.focus();
  }

  showQuestion() {
    this.state = 0;
    this.input.val("");
    this.comment.text("");
    this.output.text(`${this.quiz.factor1} × ${this.quiz.factor2}`);
    // Update the progress text
    if (this.quiz.size == 0) {
      this.progressOutput.text(`Question ${this.quiz.progress}`);
    } else {
      this.progressOutput.text(`Question ${this.quiz.progress}/${this.quiz.size}`);
    }
    // Set focus to the input at the end for convenience
    this.input.focus();
  }

  showAnswer() {
    this.state = 1;
    // Get answer before answering the quiz and generating a new question
    var answer = this.quiz.getAnswer();
    if (this.quiz.answerQuestion(parseInt(this.input.val()))) {
      this.comment.text("Correct!");
    } else {
      this.comment.text(`Wrong! The answer is ${answer}!`);
    }
  }

  showResults() {
    this.state = 2;
    var correctAnswers = this.quiz.correctAnswers;
    var quizSize = this.quiz.size;

    this.output.text(`${correctAnswers}/${quizSize} (${(correctAnswers/quizSize*100).toFixed(1)}%)`);
    this.comment.text("Press enter to try again");
  }

  restart() {
    this.quiz.restart();
    this.showQuestion();
  }
}