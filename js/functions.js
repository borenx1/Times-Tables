$(document).ready(function() {
  console.log("functions.js loaded");
});

/**
 * Generates and returns a times table.
 * @param {*} rowMax Maximum row number.
 * @param {*} colMax Maximum column number.
 * @param {*} rowMin Minimum row number. Defaults to 1.
 * @param {*} colMin Minimum column number. Defaults to 1.
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

function initQuiz(size, minFactor, outputId, inputId, enterButtonId) {
  console.log("Initialize quiz; size: " + size + ", min factor: " + minFactor);
  var output = $("#" + outputId);
  var input = $("#" + inputId);
  var enterButton = $("#" + enterButtonId);

  // Init quiz variables
  var progress = 1;
  var factor1;
  var factor2;



  // Set focus to the input in the end for convenience
  input.focus();
}