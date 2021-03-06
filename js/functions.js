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
function generate_times_table(rowMax, colMax, rowMin = 1, colMin = 1) {
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