/**
 * Generates and returns a times table object (table element in jQuery).
 * @param {number} rowMax Maximum row number.
 * @param {number} colMax Maximum column number.
 * @param {function} hoverCallback Callback when a cell is hovered, receives 2 arguments: row and column of the cell.
 * @param {string} class_ The class of the <table/> element.
 * @returns A jQuery table object.
 */
 function generateTimesTable(rowMax, colMax, hoverCallback = null, class_ = "times-table") {
  console.log("Generate " + rowMax + " x " + colMax + " times table");
  var table = $("<table/>", {"class": class_});
  var tableRows = [];
  for (let i = 1; i <= rowMax; i++) {
    let rowItems = ["<tr>"];
    for (let j = 1; j <= colMax; j++) {
      let number = i * j;
      // Use table header <th/> if first row or column, else <td/>
      let cellTag = (i == 1 || j == 1) ? "th" : "td";
      let cell = `<${cellTag} data-row="${i}" data-col="${j}">${number}</${cellTag}>`;
      rowItems.push(cell);
    }
    rowItems.push("</tr>");
    tableRows.push(rowItems.join(""));
  }
  table.html(tableRows.join(""));
  // Add JS to the table to add styles when hovering over a cell
  table.find("td").hover(function() {
    let row = this.getAttribute("data-row");
    let col = this.getAttribute("data-col");
    // Highlight header cells with the same row or column
    table.find(`th[data-row="${row}"], th[data-col="${col}"]`).addClass("hover");
    // Highlight table cells with the same row or column (except the hovered cell)
    table.find(`td[data-row="${row}"], td[data-col="${col}"]`)
         .filter(`:not([data-row="${row}"][data-col="${col}"])`)
         .addClass("hover blur");
    // Execute callback from argument
    if (hoverCallback) {
      hoverCallback(row, col);
    }
  }, function() {
    // Remove hover related classes when mouse exits the cell
    table.find("td, th").removeClass("hover blur");
  });

  return table
}

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
    $("#times-table-container").html(generateTimesTable(this.value, this.value, function(row, col) {
      // Might need this callback later
      // console.log(`${row}, ${col}`);
    }));
    // Change "Go to quiz" link to the current level
    $("#quiz-link").attr("href", "times-table-quiz.html?level=" + this.value);
  });

  // Generate default table on load
  $("#select-level").trigger("change");
});