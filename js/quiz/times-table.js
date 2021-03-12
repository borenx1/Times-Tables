/** The logic for the times table quiz. */
export class TimesTableQuiz {
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
  export class TimesTableQuizController {
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